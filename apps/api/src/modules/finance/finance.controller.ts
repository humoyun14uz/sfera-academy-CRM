import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  UsePipes,
  ForbiddenException,
} from '@nestjs/common'
import { FinanceService } from './finance.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RbacGuard } from '../../common/guards/rbac.guard'
import { ScopeGuard } from '../../common/guards/scope.guard'
import { RequirePermission } from '../../common/decorators/require-permission.decorator'
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import {
  createInvoiceSchema,
  CreateInvoiceDto,
  recordPaymentSchema,
  RecordPaymentDto,
  refundPaymentSchema,
  RefundPaymentDto,
} from '@sfera/contracts'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, RbacGuard, ScopeGuard)
@Controller('api/v1/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('invoices')
  @RequirePermission('finance.invoices.read')
  @ApiOperation({ summary: 'List invoices in academy (filtered to self if Student)' })
  async listInvoices(
    @CurrentUser() user: AuthenticatedUser,
    @Query('studentId') queryStudentId?: string
  ) {
    if (user.role === 'Student') {
      // Fail closed. Previously this read `(user as any).studentId`, which was
      // never set, so `studentId` became `undefined` and the academy-wide query
      // returned every student's invoices to a Student token.
      if (!user.studentId) {
        throw new ForbiddenException(
          'Your account is not linked to a student profile'
        )
      }
      return this.financeService.listInvoices(user.academyId, user.studentId)
    }

    return this.financeService.listInvoices(user.academyId, queryStudentId)
  }

  @Post('invoices')
  @RequirePermission('finance.invoices.create')
  @UsePipes(new ZodValidationPipe(createInvoiceSchema))
  @ApiOperation({ summary: 'Create new invoice' })
  async createInvoice(
    @Body() dto: CreateInvoiceDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.financeService.createInvoice(user.academyId, dto, user.id)
  }

  @Get('payments')
  @RequirePermission('finance.payments.read')
  @ApiOperation({ summary: 'List payment transactions in academy' })
  async listPayments(@CurrentUser() user: AuthenticatedUser) {
    return this.financeService.listPayments(user.academyId)
  }

  @Post('payments')
  @RequirePermission('finance.payments.create')
  @UsePipes(new ZodValidationPipe(recordPaymentSchema))
  @ApiOperation({ summary: 'Record payment transactionally (reduces debt and updates status)' })
  async recordPayment(
    @Body() dto: RecordPaymentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.financeService.recordPayment(user.academyId, dto, user.id)
  }

  @Post('refunds')
  @RequirePermission('finance.refunds.create')
  @UsePipes(new ZodValidationPipe(refundPaymentSchema))
  @ApiOperation({ summary: 'Process refund transactionally' })
  async refundPayment(
    @Body() dto: RefundPaymentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.financeService.refundPayment(user.academyId, dto, user.id)
  }

  @Get('summary')
  @RequirePermission('finance.reports.read')
  @ApiOperation({ summary: 'Get aggregated financial summary (invoiced, collected, debt, refunds)' })
  async getSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.financeService.getFinancialSummary(user.academyId, startDate, endDate)
  }
}

