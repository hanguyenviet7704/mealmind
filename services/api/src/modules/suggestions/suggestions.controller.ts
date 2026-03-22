import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GetSuggestionsDto, SwapComboItemDto, RefreshSuggestionsDto } from './dto/suggestions.dto';

@ApiTags('suggestions')
@ApiBearerAuth()
@Controller('suggestions')
@UseGuards(JwtAuthGuard)
export class SuggestionsController {
  constructor(private suggestionsService: SuggestionsService) {}

  // MS-005
  @Get()
  @ApiOperation({ summary: 'Gợi ý thông minh', description: 'Gợi ý bữa ăn dựa trên context người dùng (lịch sử, thời tiết, sở thích cá nhân).' })
  async getSuggestions(
    @CurrentUser('sub') userId: string,
    @Query() query: GetSuggestionsDto,
  ) {
    return this.suggestionsService.getSuggestions(userId, {
      profileId: query.profileId,
      mealType: query.mealType,
      count: query.count,
    });
  }

  // MS-013
  @Get('surprise')
  @ApiOperation({ summary: 'Món ăn bất ngờ', description: 'Sinh ra gợi ý thức ăn ngẫu nhiên phá vỡ routine nhưng hợp khẩu vị.' })
  @ApiQuery({ name: 'profileId', required: true, description: 'ID của family profile cần tham số' })
  async getSurprise(
    @CurrentUser('sub') userId: string,
    @Query('profileId') profileId: string,
  ) {
    return this.suggestionsService.getSurpriseSuggestions(userId, profileId);
  }

  // MS-014
  @Get('combo')
  @ApiOperation({ summary: 'Gợi ý bữa cơm đầy đủ', description: 'Gợi ý nguyên mâm cơm gia đình (gồm cơm nát, cháo, canh, mặn... theo nhu cầu).' })
  @ApiQuery({ name: 'profileId', required: true, description: 'ID của profile gia đình' })
  async getCombo(
    @CurrentUser('sub') userId: string,
    @Query('profileId') profileId: string,
  ) {
    return this.suggestionsService.getComboSuggestions(userId, profileId);
  }

  // MS-015
  @Post('combo/swap')
  @ApiOperation({ summary: 'Đổi món trong Combo', description: 'Thay thế 1 món trong bộ Combo đang làm thành món khác cùng loại nhưng hợp lí hơn.' })
  async swapComboItem(
    @CurrentUser('sub') userId: string,
    @Body() body: SwapComboItemDto,
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
  @ApiOperation({ summary: 'Tải lại gợi ý', description: 'Refresh phần gợi ý hiển thị ở ngoài màn hình chính loại trừ những món đã hiển thị.' })
  async refreshSuggestions(
    @CurrentUser('sub') userId: string,
    @Body() body: RefreshSuggestionsDto,
  ) {
    return this.suggestionsService.refreshSuggestions(userId, body.excludeIds, {
      profileId: body.profileId,
      mealType: body.mealType,
      count: body.count,
    });
  }

  // MS-017
  @Get('context')
  @ApiOperation({ summary: 'Lấy bối cảnh hiện tại', description: 'Ví dụ: trả về thông báo thời tiết (Trời lạnh) cho client hiển thị.' })
  async getContext() {
    return this.suggestionsService.getContext();
  }
}
