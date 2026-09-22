import { Controller, Get, Post, Body, Param, UseGuards, UsePipes } from '@nestjs/common'
import { type LeadsService } from './leads.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RbacGuard } from '../../common/guards/rbac.guard'
import { RequirePermission } from '../../common/decorators/require-permission.decorator'
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { createLeadSchema, type CreateLeadDto, convertLeadSchema, type ConvertLeadDto } from '@sfera/contracts'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, RbacGuard)
@Controller('api/v1/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @RequirePermission('leads.read')
  @ApiOperation({ summary: 'List CRM leads' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.leadsService.findAll(user.academyId)
  }

  @Post()
  @RequirePermission('leads.create')
  @UsePipes(new ZodValidationPipe(createLeadSchema))
  @ApiOperation({ summary: 'Create new lead' })
  async create(
    @Body() dto: CreateLeadDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.leadsService.create(user.academyId, dto, user.id)
  }

  @Post(':leadId/convert')
  @RequirePermission('leads.convert')
  @UsePipes(new ZodValidationPipe(convertLeadSchema))
  @ApiOperation({ summary: 'Convert lead to Student & Group Enrollment (transactional)' })
  async convert(
    @Param('leadId') leadId: string,
    @Body() dto: ConvertLeadDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.leadsService.convertToStudent(user.academyId, leadId, dto, user.id)
  }
}

