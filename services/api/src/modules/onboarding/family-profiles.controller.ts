import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('family-profiles')
@UseGuards(JwtAuthGuard)
export class FamilyProfilesController {
  constructor(private onboardingService: OnboardingService) {}

  @Get()
  async getAll(@CurrentUser('sub') userId: string) {
    return this.onboardingService.getFamilyProfiles(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser('sub') userId: string, @Body() body: any) {
    return this.onboardingService.createFamilyProfile(userId, body);
  }

  @Patch(':profileId')
  async update(@CurrentUser('sub') userId: string, @Param('profileId') profileId: string, @Body() body: any) {
    return this.onboardingService.updateFamilyProfile(userId, profileId, body);
  }

  @Delete(':profileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser('sub') userId: string, @Param('profileId') profileId: string) {
    await this.onboardingService.deleteFamilyProfile(userId, profileId);
  }

  @Patch('active')
  async setActive(@CurrentUser('sub') userId: string, @Body() body: { profileId: string | null }) {
    return this.onboardingService.setActiveProfile(userId, body.profileId);
  }

  @Get('merged')
  async getMerged(@CurrentUser('sub') userId: string) {
    return this.onboardingService.getMergedPreferences(userId);
  }
}
