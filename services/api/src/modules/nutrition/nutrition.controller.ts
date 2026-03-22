import { Controller, Get, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class NutritionController {
  constructor(private nutritionService: NutritionService) {}

  // NT-001
  @Get('recipes/:recipeId/nutrition')
  async getRecipeNutrition(
    @Param('recipeId') recipeId: string,
    @Query('servings') servings: string,
  ) {
    return this.nutritionService.getRecipeNutrition(
      recipeId,
      servings ? parseInt(servings) : undefined,
    );
  }

  // NT-002
  @Get('nutrition/daily')
  async getDailyNutrition(
    @CurrentUser('sub') userId: string,
    @Query('date') date: string,
  ) {
    return this.nutritionService.getDailyNutrition(userId, date);
  }

  // NT-003
  @Get('nutrition/weekly')
  async getWeeklyNutrition(@CurrentUser('sub') userId: string) {
    return this.nutritionService.getWeeklyNutrition(userId);
  }

  // NT-004
  @Get('nutrition/goals')
  async getGoals(@CurrentUser('sub') userId: string) {
    return this.nutritionService.getGoals(userId);
  }

  @Put('nutrition/goals')
  async updateGoals(@CurrentUser('sub') userId: string, @Body() body: any) {
    return this.nutritionService.updateGoals(userId, body);
  }
}
