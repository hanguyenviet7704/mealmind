import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // G9: List notifications
  @Get('notifications')
  async list(
    @CurrentUser('sub') userId: string,
    @Query() query: any,
  ) {
    return this.notificationsService.list(userId, {
      unreadOnly: query.unreadOnly === 'true',
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 20,
    });
  }

  // G10: Mark notification as read
  @Patch('notifications/:id/read')
  async markRead(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.notificationsService.markRead(userId, id);
  }

  // G11: Mark all notifications as read
  @Post('notifications/mark-all-read')
  @HttpCode(HttpStatus.OK)
  async markAllRead(@CurrentUser('sub') userId: string) {
    return this.notificationsService.markAllRead(userId);
  }

  // Delete notification
  @Delete('notifications/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    await this.notificationsService.delete(userId, id);
  }

  // G12: Get notification settings
  @Get('users/me/notification-settings')
  async getSettings(@CurrentUser('sub') userId: string) {
    return this.notificationsService.getSettings(userId);
  }

  // G12: Update notification settings
  @Patch('users/me/notification-settings')
  async updateSettings(
    @CurrentUser('sub') userId: string,
    @Body() body: { settings: Array<{ type: string; enabled: boolean; time?: string }> },
  ) {
    return this.notificationsService.updateSettings(userId, body.settings);
  }
}
