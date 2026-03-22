import { Controller, Get, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { DietaryService } from './dietary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class DietaryController {
  constructor(private dietaryService: DietaryService) {}

  // DF-001
  @Get('users/:userId/dietary')
  async getDietaryRestrictions(
    @Param('userId') userId: string,
    @Query('profileId') profileId: string,
    @CurrentUser('sub') requesterId: string,
  ) {
    return this.dietaryService.getDietaryRestrictions(userId, requesterId, profileId);
  }

  // DF-001
  @Put('users/:userId/dietary')
  async updateDietaryRestrictions(
    @Param('userId') userId: string,
    @Body() body: any,
    @CurrentUser('sub') requesterId: string,
  ) {
    return this.dietaryService.updateDietaryRestrictions(userId, requesterId, body);
  }

  // DF-002
  @Get('dietary/options')
  getDietaryOptions() {
    return this.dietaryService.getDietaryOptions();
  }
}
