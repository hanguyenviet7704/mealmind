import { Controller, Get, Post, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { MealLogsService } from './meal-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('meal-logs')
@UseGuards(JwtAuthGuard)
export class MealLogsController {
  constructor(private mealLogsService: MealLogsService) {}

  // G13: Create meal log (rate / complete cooking)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('sub') userId: string,
    @Body() body: {
      recipeId: string;
      mealType: string;
      date?: string;
      rating?: number;
      notes?: string;
      profileId?: string;
    },
  ) {
    return this.mealLogsService.create(userId, body);
  }

  // G14: List meal logs (cooking history)
  @Get()
  async list(
    @CurrentUser('sub') userId: string,
    @Query() query: any,
  ) {
    return this.mealLogsService.list(userId, {
      startDate: query.startDate,
      endDate: query.endDate,
      mealType: query.mealType,
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 20,
    });
  }

  // G15: Cooking stats
  @Get('stats')
  async getStats(@CurrentUser('sub') userId: string) {
    return this.mealLogsService.getStats(userId);
  }
}
