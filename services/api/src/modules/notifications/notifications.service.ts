import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ResourceNotFoundException } from '@/common/exceptions';
import { paginate } from '@/common/dto/pagination.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // G9: List notifications
  async list(userId: string, params: {
    unreadOnly?: boolean;
    page?: number;
    pageSize?: number;
  }) {
    const { unreadOnly = false, page = 1, pageSize = 20 } = params;

    const where: any = { userId };
    if (unreadOnly) where.readAt = null;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.notification.count({ where }),
    ]);

    const unreadCount = await this.prisma.notification.count({
      where: { userId, readAt: null },
    });

    return {
      ...paginate(notifications, total, page, pageSize),
      unreadCount,
    };
  }

  // G10: Mark notification as read
  async markRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });
    if (!notification) throw new ResourceNotFoundException('Notification');

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }

  // G11: Mark all as read
  async markAllRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { markedCount: result.count };
  }

  // G12: Get notification settings
  async getSettings(userId: string) {
    const settings = await this.prisma.notificationSetting.findMany({
      where: { userId },
    });

    // If no settings exist yet, return defaults
    if (settings.length === 0) {
      return this.getDefaultSettings();
    }

    return settings;
  }

  // G12: Update notification settings
  async updateSettings(userId: string, settings: Array<{
    type: string;
    enabled: boolean;
    time?: string;
  }>) {
    const results = [];
    for (const setting of settings) {
      const result = await this.prisma.notificationSetting.upsert({
        where: { userId_type: { userId, type: setting.type } },
        update: { enabled: setting.enabled, time: setting.time },
        create: {
          userId,
          type: setting.type,
          enabled: setting.enabled,
          time: setting.time,
        },
      });
      results.push(result);
    }
    return results;
  }

  // Create a notification (internal use by other services)
  async create(userId: string, data: {
    type: string;
    title: string;
    body: string;
    link?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: data.type as any,
        title: data.title,
        body: data.body,
        link: data.link,
      },
    });
  }

  // Delete notification
  async delete(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });
    if (!notification) throw new ResourceNotFoundException('Notification');

    await this.prisma.notification.delete({ where: { id: notificationId } });
  }

  private getDefaultSettings() {
    return [
      { type: 'meal_breakfast', enabled: true, time: '07:00' },
      { type: 'meal_lunch', enabled: true, time: '11:30' },
      { type: 'meal_dinner', enabled: true, time: '17:30' },
      { type: 'plan_reminder', enabled: true, time: '20:00' },
      { type: 'timer', enabled: true, time: null },
      { type: 'weekly_report', enabled: true, time: '09:00' },
      { type: 'feature', enabled: true, time: null },
      { type: 'promo', enabled: false, time: null },
    ];
  }
}
