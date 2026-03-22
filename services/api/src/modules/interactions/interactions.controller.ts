import { Controller, Post, Get, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('interactions')
@UseGuards(JwtAuthGuard)
export class InteractionsController {
  constructor(private interactionsService: InteractionsService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async createBatch(
    @CurrentUser('sub') userId: string,
    @Body() body: { interactions: Array<{ recipeId: string; action: string; source?: string; profileId?: string }> },
  ) {
    return this.interactionsService.createBatch(userId, body.interactions);
  }

  @Get('history')
  async getHistory(@CurrentUser('sub') userId: string, @Query() query: any) {
    return this.interactionsService.getHistory(userId, {
      action: query.action,
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 20,
    });
  }
}
