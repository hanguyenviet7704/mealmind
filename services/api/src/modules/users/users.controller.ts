import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // G3: Update user profile
  @Patch('me')
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() body: { name?: string; avatarUrl?: string },
  ) {
    return this.usersService.updateProfile(userId, body);
  }
}
