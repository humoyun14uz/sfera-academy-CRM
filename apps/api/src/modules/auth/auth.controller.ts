import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/require-permission.decorator'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('Authentication & Identity')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user profile, roles, and permissions' })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user.id, user.academyId)
  }

  @Post('sync-clerk')
  @Public()
  @ApiOperation({ summary: 'Sync user record from Clerk webhook or client login' })
  async syncClerk(
    @Body()
    body: {
      clerkId: string
      email: string
      firstName: string
      lastName: string
      phone?: string
      avatarUrl?: string
      defaultAcademySlug?: string
    }
  ) {
    return this.authService.syncClerkUser(body)
  }
}

