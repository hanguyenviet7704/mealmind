import { Controller, Post, Delete, Get, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BookmarkFilterDto } from './dto/recipes.dto';

@ApiTags('recipes')
@ApiBearerAuth()
@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private recipesService: RecipesService) {}

  @Post(':recipeId/bookmark')
  @ApiOperation({ summary: 'Lưu công thức (BookmarksController)', description: 'Đánh dấu công thức vào danh sách tham khảo cá nhân.' })
  @ApiParam({ name: 'recipeId', description: 'ID của công thức cần lưu' })
  @HttpCode(HttpStatus.CREATED)
  async bookmark(@CurrentUser('sub') userId: string, @Param('recipeId') recipeId: string) {
    return this.recipesService.bookmarkRecipe(userId, recipeId);
  }

  @Delete(':recipeId/bookmark')
  @ApiOperation({ summary: 'Bỏ lưu công thức (BookmarksController)', description: 'Xóa công thức khỏi bookmark.' })
  @ApiParam({ name: 'recipeId', description: 'ID công thức' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBookmark(@CurrentUser('sub') userId: string, @Param('recipeId') recipeId: string) {
    await this.recipesService.removeBookmark(userId, recipeId);
  }

  @Get('bookmarks')
  @ApiOperation({ summary: 'Danh sách công thức đã lưu (BookmarksController)', description: 'Lấy các công thức đã bookmark.' })
  async getBookmarks(@CurrentUser('sub') userId: string, @Query() query: BookmarkFilterDto) {
    return this.recipesService.getBookmarkedRecipes(userId, {
      q: query.q,
      cuisine: query.cuisine,
      mealType: query.mealType,
      page: query.page,
      pageSize: query.pageSize,
    });
  }
}
