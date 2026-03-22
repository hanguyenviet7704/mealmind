import { Controller, Get, Post, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { MealLogsService } from './meal-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateMealLogDto, ListMealLogsQueryDto } from './dto/meal-logs.dto';

@ApiTags('planning')
@ApiBearerAuth()
@Controller('meal-logs')
@UseGuards(JwtAuthGuard)
export class MealLogsController {
  constructor(private mealLogsService: MealLogsService) {}

  // G13: Create meal log (rate / complete cooking)
  @Post()
  @ApiOperation({ summary: 'Lưu lịch sử nấu ăn', description: 'Ghi nhận món ăn đã hoàn thành, có thể kèm theo đánh giá và ghi chú.' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('sub') userId: string,
    @Body() body: CreateMealLogDto,
  ) {
    return this.mealLogsService.create(userId, body);
  }

  // G14: List meal logs (cooking history)
  @Get()
  @ApiOperation({ summary: 'Lịch sử nấu ăn', description: 'Liệt kê các món ăn đã nấu kèm bộ lọc thời gian.' })
  async list(
    @CurrentUser('sub') userId: string,
    @Query() query: ListMealLogsQueryDto,
  ) {
    return this.mealLogsService.list(userId, {
      startDate: query.startDate,
      endDate: query.endDate,
      mealType: query.mealType,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  // G15: Cooking stats
  @Get('stats')
  @ApiOperation({ summary: 'Thống kê nấu ăn', description: 'Trả về các thống kê thói quen nấu nướng của người dùng.' })
  async getStats(@CurrentUser('sub') userId: string) {
    return this.mealLogsService.getStats(userId);
  }
}
