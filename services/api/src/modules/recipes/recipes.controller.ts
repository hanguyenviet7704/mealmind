import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class RecipesController {
  constructor(private recipesService: RecipesService) { }

  @Get()
  async list(@Query() query: any) {
    return this.recipesService.listRecipes({
      cuisine: query.cuisine,
      mealType: query.mealType,
      difficulty: query.difficulty,
      maxCookTime: query.maxCookTime ? parseInt(query.maxCookTime) : undefined,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 20,
    });
  }

  @Get('search')
  async search(@Query() query: any) {
    // TODO: Integrate Meilisearch (RD-008)
    // Fallback to ILIKE search for now
    return this.recipesService.listRecipes({
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 20,
    });
  }

  @Get('random')
  async random(@Query('count') count: string) {
    return this.recipesService.getRandomRecipes(
      count ? parseInt(count) : 1,
    );
  }

  @Get('combo')
  async combo(@Query('servings') servings: string) {
    return this.recipesService.getAiCombo(
      servings ? parseInt(servings) : 2,
    );
  }

  @Get('bookmarks')
  async getBookmarks(
    @CurrentUser('sub') userId: string,
    @Query() query: any,
  ) {
    return this.recipesService.getBookmarkedRecipes(userId, {
      q: query.q,
      cuisine: query.cuisine,
      mealType: query.mealType,
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 20,
    });
  }

  @Post(':recipeId/bookmark')
  async bookmark(
    @Param('recipeId') recipeId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.recipesService.bookmarkRecipe(userId, recipeId);
  }

  @Delete(':recipeId/bookmark')
  async unbookmark(
    @Param('recipeId') recipeId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.recipesService.removeBookmark(userId, recipeId);
  }

  @Get(':recipeId')
  async detail(
    @Param('recipeId') recipeId: string,
    @Query('servings') servings: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.recipesService.getRecipeDetail(
      recipeId,
      servings ? parseInt(servings) : undefined,
      userId,
    );
  }
}

