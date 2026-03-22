import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('taste-profiles')
@UseGuards(JwtAuthGuard)
export class TasteProfilesController {
  constructor(private onboardingService: OnboardingService) {}

  @Get()
  async getAll(@CurrentUser('sub') userId: string) {
    return this.onboardingService.getTasteProfiles(userId);
  }

  @Get(':profileId')
  async getOne(@CurrentUser('sub') userId: string, @Param('profileId') profileId: string) {
    return this.onboardingService.getTasteProfile(userId, profileId);
  }

  @Patch(':profileId')
  async update(@CurrentUser('sub') userId: string, @Param('profileId') profileId: string, @Body() body: any) {
    return this.onboardingService.updateTasteProfile(userId, profileId, body);
  }
}
