import { Controller, Get, Post, Body, Param, UseGuards, UsePipes } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RbacGuard } from '../../common/guards/rbac.guard'
import { ScopeGuard } from '../../common/guards/scope.guard'
import { RequirePermission } from '../../common/decorators/require-permission.decorator'
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { createGroupSchema, CreateGroupDto, assignTeacherSchema, AssignTeacherDto } from '@sfera/contracts'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, RbacGuard, ScopeGuard)
@Controller('api/v1/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @RequirePermission('groups.read')
  @ApiOperation({ summary: 'List groups (filtered by teacher assignment if teacher)' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    const teacherId = user.role === 'Teacher' ? user.id : undefined
    return this.groupsService.findAll(user.academyId, teacherId)
  }

  @Get(':groupId')
  @RequirePermission('groups.read')
  @ApiOperation({ summary: 'Get group details by ID' })
  async findById(
    @Param('groupId') groupId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.groupsService.findById(user.academyId, groupId)
  }

  @Post()
  @RequirePermission('groups.create')
  @UsePipes(new ZodValidationPipe(createGroupSchema))
  @ApiOperation({ summary: 'Create group' })
  async create(
    @Body() dto: CreateGroupDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.groupsService.create(user.academyId, dto, user.id)
  }

  @Post(':groupId/teachers')
  @RequirePermission('groups.assign_teacher')
  @UsePipes(new ZodValidationPipe(assignTeacherSchema))
  @ApiOperation({ summary: 'Assign teacher to group' })
  async assignTeacher(
    @Param('groupId') groupId: string,
    @Body() dto: AssignTeacherDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.groupsService.assignTeacher(groupId, dto, user.id)
  }

  @Get(':groupId/students')
  @RequirePermission('groups.read')
  @ApiOperation({ summary: 'List enrolled students in group' })
  async getStudents(@Param('groupId') groupId: string) {
    return this.groupsService.getStudents(groupId)
  }
}

