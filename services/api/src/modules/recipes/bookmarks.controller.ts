import { Controller, Post, Delete, Get, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private recipesService: RecipesService) {}

  @Post(':recipeId/bookmark')
  @HttpCode(HttpStatus.CREATED)
  async bookmark(@CurrentUser('sub') userId: string, @Param('recipeId') recipeId: string) {
    return this.recipesService.bookmarkRecipe(userId, recipeId);
  }

  @Delete(':recipeId/bookmark')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBookmark(@CurrentUser('sub') userId: string, @Param('recipeId') recipeId: string) {
    await this.recipesService.removeBookmark(userId, recipeId);
  }

  @Get('bookmarks')
  async getBookmarks(@CurrentUser('sub') userId: string, @Query() query: any) {
    return this.recipesService.getBookmarkedRecipes(userId, {
      q: query.q,
      cuisine: query.cuisine,
      mealType: query.mealType,
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 20,
    });
  }
}
