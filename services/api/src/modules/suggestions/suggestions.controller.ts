import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('suggestions')
@UseGuards(JwtAuthGuard)
export class SuggestionsController {
  constructor(private suggestionsService: SuggestionsService) {}

  // MS-005
  @Get()
  async getSuggestions(
    @CurrentUser('sub') userId: string,
    @Query() query: any,
  ) {
    return this.suggestionsService.getSuggestions(userId, {
      profileId: query.profileId,
      mealType: query.mealType,
      count: query.count ? parseInt(query.count) : undefined,
    });
  }

  // MS-013
  @Get('surprise')
  async getSurprise(
    @CurrentUser('sub') userId: string,
    @Query('profileId') profileId: string,
  ) {
    return this.suggestionsService.getSurpriseSuggestions(userId, profileId);
  }

  // MS-014
  @Get('combo')
  async getCombo(
    @CurrentUser('sub') userId: string,
    @Query('profileId') profileId: string,
  ) {
    return this.suggestionsService.getComboSuggestions(userId, profileId);
  }

  // MS-015
  @Post('combo/swap')
  async swapComboItem(
    @CurrentUser('sub') userId: string,
    @Body() body: { role: string; mealType: string; excludeIds: string[] },
  ) {
    const rawAlternatives = await this.suggestionsService.swapAlternatives(userId, body.role, body.mealType, body.excludeIds || []);
    return rawAlternatives.map(r => ({
      id: r.id,
      name: r.name,
      imageUrl: r.imageUrl,
      cookTime: r.cookTime,
      difficulty: r.difficulty,
      calories: r.nutritionInfo ? Number(r.nutritionInfo.calories) : 0,
      cuisine: r.cuisine,
      mealTypes: r.mealTypes,
    }));
  }

  // MS-016
  @Post('refresh')
  async refreshSuggestions(
    @CurrentUser('sub') userId: string,
    @Body() body: { excludeIds: string[]; mealType?: string; count?: number; profileId?: string },
  ) {
    return this.suggestionsService.refreshSuggestions(userId, body.excludeIds, {
      profileId: body.profileId,
      mealType: body.mealType,
      count: body.count,
    });
  }

  // MS-017
  @Get('context')
  async getContext() {
    return this.suggestionsService.getContext();
  }
}
