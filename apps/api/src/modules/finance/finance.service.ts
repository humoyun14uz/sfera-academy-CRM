import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import {
  type createDb,
  invoices,
  invoiceCounters,
  invoiceItems,
  payments,
  refunds,
  students,
} from '@sfera/db'
import { eq, and, sql, desc, gte, lte, ne } from 'drizzle-orm'
import {
  type CreateInvoiceDto,
  type RecordPaymentDto,
  type RefundPaymentDto,
} from '@sfera/contracts'
import { type AuditLogsService } from '../audit-logs/audit-logs.service'

@Injectable()
export class FinanceService {
  constructor(
    @Inject('DATABASE') private db: ReturnType<typeof createDb>,
    private auditLogsService: AuditLogsService
  ) {}

  async listInvoices(academyId: string, studentId?: string) {
    if (studentId) {
      return this.db
        .select()
        .from(invoices)
        .where(
          and(
            eq(invoices.academyId, academyId),
            eq(invoices.studentId, studentId)
          )
        )
        .orderBy(desc(invoices.createdAt))
    }

    return this.db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        studentId: invoices.studentId,
        studentFirstName: students.firstName,
        studentLastName: students.lastName,
        amount: invoices.amount,
        paidAmount: invoices.paidAmount,
        debtAmount: invoices.debtAmount,
        status: invoices.status,
        dueDate: invoices.dueDate,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .innerJoin(students, eq(invoices.studentId, students.id))
      .where(eq(invoices.academyId, academyId))
      .orderBy(desc(invoices.createdAt))
  }

  async createInvoice(
    academyId: string,
    dto: CreateInvoiceDto,
    userId?: string
  ) {
    const student = await this.db
      .select()
      .from(students)
      .where(
        and(eq(students.id, dto.studentId), eq(students.academyId, academyId))
      )
      .limit(1)

    if (student.length === 0) {
      throw new NotFoundException('Student not found in this academy')
    }

    const items = dto.items ?? []
    const itemsTotal = items.reduce(
      (sum, item) => sum + Math.round(item.quantity * item.unitPrice),
      0
    )

    // The line items are the source of truth for the total. A mismatch is a
    // client bug or tampering, so it is rejected rather than trusted.
    if (items.length > 0 && itemsTotal !== Math.round(dto.amount)) {
      throw new BadRequestException(
        `Invoice items total (${itemsTotal}) does not match the invoice amount (${dto.amount})`
      )
    }

    const amount = Math.round(dto.amount)

    const created = await this.db.transaction(async (tx) => {
      // Atomic per-academy sequence: UPSERT ... RETURNING means two concurrent
      // invoice creations can never receive the same number.
      const [counter] = await tx
        .insert(invoiceCounters)
        .values({ academyId, lastValue: 1 })
        .onConflictDoUpdate({
          target: invoiceCounters.academyId,
          set: {
            lastValue: sql`${invoiceCounters.lastValue} + 1`,
            updatedAt: new Date(),
          },
        })
        .returning()

      const invoiceNumber = `INV-${new Date().getUTCFullYear()}-${String(
        counter.lastValue
      ).padStart(6, '0')}`

      const [invoice] = await tx
        .insert(invoices)
        .values({
          academyId,
          studentId: dto.studentId,
          enrollmentId: dto.enrollmentId || null,
          invoiceNumber,
          amount,
          paidAmount: 0,
          debtAmount: amount,
          status: 'pending',
          dueDate: dto.dueDate,
          description: dto.description || null,
          createdBy: userId ?? null,
        })
        .returning()

      if (items.length > 0) {
        await tx.insert(invoiceItems).values(
          items.map((item) => ({
            invoiceId: invoice.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: Math.round(item.unitPrice),
            amount: Math.round(item.quantity * item.unitPrice),
          }))
        )
      }

      return invoice
    })

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'INVOICE_CREATED',
      entityType: 'invoices',
      entityId: created.id,
      payloadAfter: {
        invoiceId: created.id,
        invoiceNumber: created.invoiceNumber,
        amount: created.amount,
        studentId: created.studentId,
        itemCount: items.length,
        source: 'manual',
      },
    })

    return created
  }

  async recordPayment(
    academyId: string,
    dto: RecordPaymentDto,
    userId: string
  ) {
    // Idempotency fast path: a replayed submit (double click, client retry,
    // network replay) returns the original payment instead of recording a
    // second one.
    if (dto.idempotencyKey) {
      const replay = await this.findPaymentByIdempotencyKey(
        academyId,
        dto.idempotencyKey
      )
      if (replay) return replay
    }

    try {
      return await this.performPayment(academyId, dto, userId)
    } catch (err: unknown) {
      // Concurrent duplicate submit: the composite unique index rejected the
      // second row. Return the winner so the caller still sees one success.
      if (dto.idempotencyKey && this.isUniqueViolation(err)) {
        const replay = await this.findPaymentByIdempotencyKey(
          academyId,
          dto.idempotencyKey
        )
        if (replay) return replay
      }
      throw err
    }
  }

  private async findPaymentByIdempotencyKey(
    academyId: string,
    idempotencyKey: string
  ) {
    const [payment] = await this.db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.academyId, academyId),
          eq(payments.idempotencyKey, idempotencyKey)
        )
      )
      .limit(1)

    if (!payment) return undefined

    const [invoice] = await this.db
      .select()
      .from(invoices)
      .where(eq(invoices.id, payment.invoiceId))
      .limit(1)

    return { payment, invoice, idempotentReplay: true }
  }

  /** PostgreSQL SQLSTATE for `unique_violation`. */
  private isUniqueViolation(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: string }).code === '23505'
    )
  }

  private async performPayment(
    academyId: string,
    dto: RecordPaymentDto,
    userId: string
  ) {
    // Execute atomic transaction: Verify invoice, insert payment, reduce invoice debt, update invoice status
    const result = await this.db.transaction(async (tx) => {
      const invoiceList = await tx
        .select()
        .from(invoices)
        .where(
          and(eq(invoices.id, dto.invoiceId), eq(invoices.academyId, academyId))
        )
        .limit(1)

      if (invoiceList.length === 0) {
        throw new NotFoundException('Invoice not found')
      }
      const invoice = invoiceList[0]

      if (invoice.status === 'paid' || invoice.debtAmount <= 0) {
        throw new BadRequestException('This invoice has already been fully paid')
      }

      if (dto.amount > invoice.debtAmount) {
        throw new BadRequestException(
          `Payment amount (${dto.amount}) exceeds outstanding debt (${invoice.debtAmount})`
        )
      }

      // 1. Insert Payment
      const [newPayment] = await tx
        .insert(payments)
        .values({
          academyId,
          invoiceId: dto.invoiceId,
          studentId: invoice.studentId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          referenceNumber: dto.referenceNumber || null,
          idempotencyKey: dto.idempotencyKey || null,
          status: 'paid',
          source: 'manual',
          receivedBy: userId,
          description: dto.description || null,
        })
        .returning()

      // 2. Calculate new paid amount and status
      const newPaidAmount = invoice.paidAmount + dto.amount
      const newDebtAmount = invoice.amount - newPaidAmount
      const newStatus = newDebtAmount === 0 ? 'paid' : 'partially_paid'

      const [updatedInvoice] = await tx
        .update(invoices)
        .set({
          paidAmount: newPaidAmount,
          debtAmount: newDebtAmount,
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, invoice.id))
        .returning()

      return {
        payment: newPayment,
        invoice: updatedInvoice,
      }
    })

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'PAYMENT_RECORDED',
      entityType: 'payments',
      entityId: result.payment.id,
      payloadAfter: {
        paymentId: result.payment.id,
        amount: dto.amount,
        invoiceId: dto.invoiceId,
        newInvoiceStatus: result.invoice.status,
      },
    })

    return result
  }

  async refundPayment(
    academyId: string,
    dto: RefundPaymentDto,
    userId: string
  ) {
    const result = await this.db.transaction(async (tx) => {
      const paymentList = await tx
        .select()
        .from(payments)
        .where(
          and(eq(payments.id, dto.paymentId), eq(payments.academyId, academyId))
        )
        .limit(1)

      if (paymentList.length === 0) throw new NotFoundException('Payment not found')
      const payment = paymentList[0]

      if (payment.status === 'refunded') {
        throw new BadRequestException('Payment has already been refunded')
      }

      if (dto.amount > payment.amount) {
        throw new BadRequestException('Refund amount cannot exceed payment amount')
      }

      // 1. Insert Refund record
      const [newRefund] = await tx
        .insert(refunds)
        .values({
          academyId,
          paymentId: dto.paymentId,
          amount: dto.amount,
          reason: dto.reason,
          approvedBy: userId,
        })
        .returning()

      // 2. Mark payment refunded
      await tx
        .update(payments)
        .set({ status: 'refunded' })
        .where(eq(payments.id, payment.id))

      // 3. Re-adjust invoice paid and debt amounts
      const [invoice] = await tx
        .select()
        .from(invoices)
        .where(eq(invoices.id, payment.invoiceId))

      if (invoice) {
        const adjustedPaid = Math.max(0, invoice.paidAmount - dto.amount)
        const adjustedDebt = invoice.amount - adjustedPaid
        const adjustedStatus = adjustedPaid === 0 ? 'pending' : 'partially_paid'

        await tx
          .update(invoices)
          .set({
            paidAmount: adjustedPaid,
            debtAmount: adjustedDebt,
            status: adjustedStatus,
            updatedAt: new Date(),
          })
          .where(eq(invoices.id, invoice.id))
      }

      return newRefund
    })

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'PAYMENT_REFUNDED',
      entityType: 'refunds',
      entityId: result.id,
      payloadAfter: result,
    })

    return result
  }

  /**
   * Server-side financial aggregation for an explicit date range.
   *
   * Every figure is computed by PostgreSQL, never in the browser. The range is
   * applied to the correct business timestamp for each fact: invoices by issue
   * time, payments by `paidAt` (when cash was received) and refunds by creation
   * time. An unparseable or inverted range is rejected instead of being
   * silently widened into "all time", which is what previously happened.
   */
  async getFinancialSummary(
    academyId: string,
    startDate?: string,
    endDate?: string
  ) {
    const rangeStart = this.parseDateBoundary(startDate, 'startDate')
    const rangeEnd = this.parseDateBoundary(endDate, 'endDate', true)

    if (rangeStart && rangeEnd && rangeStart > rangeEnd) {
      throw new BadRequestException(
        'startDate must be earlier than or equal to endDate'
      )
    }

    const invoiceConditions = [eq(invoices.academyId, academyId)]
    if (rangeStart) invoiceConditions.push(gte(invoices.createdAt, rangeStart))
    if (rangeEnd) invoiceConditions.push(lte(invoices.createdAt, rangeEnd))

    const [invoiceAgg] = await this.db
      .select({
        invoicesIssued: sql<number>`coalesce(sum(${invoices.amount}), 0)`,
        outstandingBalance: sql<number>`coalesce(sum(${invoices.debtAmount}), 0)`,
        invoiceCount: sql<number>`count(*)`,
        pendingCount: sql<number>`count(*) filter (where ${invoices.status} = 'pending')`,
        partiallyPaidCount: sql<number>`count(*) filter (where ${invoices.status} = 'partially_paid')`,
        // "Overdue" is derived from the due date and the real outstanding debt
        // rather than trusting a status someone has to remember to write.
        overdueCount: sql<number>`count(*) filter (where ${invoices.debtAmount} > 0 and ${invoices.dueDate} < current_date)`,
        overdueBalance: sql<number>`coalesce(sum(${invoices.debtAmount}) filter (where ${invoices.debtAmount} > 0 and ${invoices.dueDate} < current_date), 0)`,
      })
      .from(invoices)
      .where(and(...invoiceConditions))

    const paymentConditions = [
      eq(payments.academyId, academyId),
      ne(payments.status, 'refunded'),
    ]
    if (rangeStart) paymentConditions.push(gte(payments.paidAt, rangeStart))
    if (rangeEnd) paymentConditions.push(lte(payments.paidAt, rangeEnd))

    const [paymentAgg] = await this.db
      .select({
        collectedRevenue: sql<number>`coalesce(sum(${payments.amount}), 0)`,
        paymentCount: sql<number>`count(*)`,
      })
      .from(payments)
      .where(and(...paymentConditions))

    const refundConditions = [eq(refunds.academyId, academyId)]
    if (rangeStart) refundConditions.push(gte(refunds.createdAt, rangeStart))
    if (rangeEnd) refundConditions.push(lte(refunds.createdAt, rangeEnd))

    const [refundAgg] = await this.db
      .select({
        totalRefunded: sql<number>`coalesce(sum(${refunds.amount}), 0)`,
        refundCount: sql<number>`count(*)`,
      })
      .from(refunds)
      .where(and(...refundConditions))

    const invoicesIssued = Number(invoiceAgg?.invoicesIssued ?? 0)
    const collected = Number(paymentAgg?.collectedRevenue ?? 0)
    const refunded = Number(refundAgg?.totalRefunded ?? 0)

    return {
      period: { startDate: startDate ?? null, endDate: endDate ?? null },
      currency: 'UZS',
      invoicesIssued,
      collectedRevenue: collected,
      outstandingBalance: Number(invoiceAgg?.outstandingBalance ?? 0),
      overdueBalance: Number(invoiceAgg?.overdueBalance ?? 0),
      totalRefunded: refunded,
      netRevenue: collected - refunded,
      collectionRate:
        invoicesIssued > 0
          ? Number(((collected / invoicesIssued) * 100).toFixed(2))
          : 0,
      counts: {
        invoices: Number(invoiceAgg?.invoiceCount ?? 0),
        pendingInvoices: Number(invoiceAgg?.pendingCount ?? 0),
        partiallyPaidInvoices: Number(invoiceAgg?.partiallyPaidCount ?? 0),
        overdueInvoices: Number(invoiceAgg?.overdueCount ?? 0),
        payments: Number(paymentAgg?.paymentCount ?? 0),
        refunds: Number(refundAgg?.refundCount ?? 0),
      },
    }
  }

  private parseDateBoundary(
    value: string | undefined,
    field: string,
    endOfDay = false
  ): Date | undefined {
    if (!value) return undefined
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`)
      : new Date(value)

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(
        `${field} must be a valid ISO date (YYYY-MM-DD)`
      )
    }
    return parsed
  }
}

