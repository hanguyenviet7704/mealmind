import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RecipesFilterDto, BookmarkFilterDto, GenerateComboDto } from './dto/recipes.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) { }

  // ───── PUBLIC ENDPOINTS (không cần đăng nhập) ─────

  @Get()
  @ApiOperation({ summary: 'Danh sách công thức', description: 'Lấy danh sách các công thức kèm bộ lọc ẩm thực, độ khó, v.v.' })
  @ApiResponse({ status: 200, description: 'Danh sách công thức phân trang.' })
  async list(@Query() query: RecipesFilterDto) {
    return this.recipesService.listRecipes({
      cuisine: query.cuisine,
      mealType: query.mealType,
      difficulty: query.difficulty,
      maxCookTime: query.maxCookTime,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm công thức', description: 'Tính năng tìm kiếm cơ bản (fallback), sau này sẽ tích hợp Meilisearch.' })
  async search(@Query() query: PaginationDto) {
    // TODO: Integrate Meilisearch (RD-008)
    // Fallback to ILIKE search for now
    return this.recipesService.listRecipes({
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Get('random')
  @ApiOperation({ summary: 'Lấy công thức ngẫu nhiên', description: 'Trả về X công thức ngẫu nhiên.' })
  @ApiQuery({ name: 'count', required: false, example: 1, description: 'Số lượng cần lấy' })
  async random(@Query('count') count?: string) {
    return this.recipesService.getRandomRecipes(
      count ? parseInt(count) : 1,
    );
  }

  @Get('combo')
  @ApiOperation({ summary: 'Gợi ý combo', description: 'Sử dụng AI tạo combo (Món chính, phụ, canh) cho số phần ăn.' })
  async combo(@Query() query: GenerateComboDto) {
    return this.recipesService.getAiCombo(query.servings ?? 2);
  }

  // ───── AUTHENTICATED ENDPOINTS (cần đăng nhập) ─────

  @Get('bookmarks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách công thức đã lưu', description: 'Lấy danh sách công thức do user hiện tại bookmark.' })
  async getBookmarks(
    @CurrentUser('sub') userId: string,
    @Query() query: BookmarkFilterDto,
  ) {
    return this.recipesService.getBookmarkedRecipes(userId, {
      q: query.q,
      cuisine: query.cuisine,
      mealType: query.mealType,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Post(':recipeId/bookmark')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lưu công thức', description: 'Đánh dấu công thức vào danh sách tham khảo cá nhân.' })
  @ApiParam({ name: 'recipeId', description: 'ID của công thức cần lưu' })
  async bookmark(
    @Param('recipeId') recipeId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.recipesService.bookmarkRecipe(userId, recipeId);
  }

  @Delete(':recipeId/bookmark')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bỏ lưu công thức', description: 'Xóa công thức khỏi danh sách bookmark.' })
  @ApiParam({ name: 'recipeId', description: 'ID công thức' })
  async unbookmark(
    @Param('recipeId') recipeId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.recipesService.removeBookmark(userId, recipeId);
  }

  // ───── SEMI-PUBLIC (có thể dùng không cần auth, nhưng nếu có auth sẽ hiển thị bookmark status) ─────

  @Get(':recipeId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Chi tiết công thức', description: 'Xem chi tiết hướng dẫn nấu 1 công thức.' })
  @ApiParam({ name: 'recipeId', description: 'ID công thức' })
  @ApiQuery({ name: 'servings', required: false, description: 'Cập nhật lại định lượng nguyên liệu theo khẩu phần' })
  async detail(
    @Param('recipeId') recipeId: string,
    @CurrentUser('sub') userId: string,
    @Query('servings') servings?: string,
  ) {
    return this.recipesService.getRecipeDetail(
      recipeId,
      servings ? parseInt(servings) : undefined,
      userId,
    );
  }
}

