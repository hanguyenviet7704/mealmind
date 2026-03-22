import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../src/modules/notifications/notifications.service';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockPrisma = {
    notification: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    notificationSetting: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  // ==========================================
  // G9: List notifications
  // ==========================================
  describe('list', () => {
    it('should return paginated notifications with unreadCount', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([
        { id: 'n1', type: 'meal_suggestion', title: 'Gợi ý bữa trưa', readAt: null },
        { id: 'n2', type: 'plan_reminder', title: 'Thực đơn tuần mới', readAt: new Date() },
      ]);
      mockPrisma.notification.count
        .mockResolvedValueOnce(2)  // total
        .mockResolvedValueOnce(1); // unread

      const result = await service.list('user-1', {});

      expect(result.data).toHaveLength(2);
      expect(result.unreadCount).toBe(1);
    });

    it('should filter unreadOnly', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);
      mockPrisma.notification.count.mockResolvedValue(0);

      await service.list('user-1', { unreadOnly: true });

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-1', readAt: null }),
        }),
      );
    });
  });

  // ==========================================
  // G10: Mark notification as read
  // ==========================================
  describe('markRead', () => {
    it('should mark a notification as read', async () => {
      mockPrisma.notification.findFirst.mockResolvedValue({ id: 'n1', readAt: null });
      mockPrisma.notification.update.mockResolvedValue({ id: 'n1', readAt: new Date() });

      const result = await service.markRead('user-1', 'n1');
      expect(result.readAt).toBeDefined();
    });

    it('should throw 404 for non-existent notification', async () => {
      mockPrisma.notification.findFirst.mockResolvedValue(null);

      await expect(
        service.markRead('user-1', 'nonexistent'),
      ).rejects.toThrow('Notification không tìm thấy');
    });
  });

  // ==========================================
  // G11: Mark all as read
  // ==========================================
  describe('markAllRead', () => {
    it('should mark all unread as read and return count', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllRead('user-1');
      expect(result.markedCount).toBe(5);
    });

    it('should return 0 if nothing to mark', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 0 });

      const result = await service.markAllRead('user-1');
      expect(result.markedCount).toBe(0);
    });
  });

  // ==========================================
  // G12: Notification settings
  // ==========================================
  describe('getSettings', () => {
    it('should return existing settings', async () => {
      const settings = [
        { type: 'meal_breakfast', enabled: true, time: '07:00' },
        { type: 'promo', enabled: false, time: null },
      ];
      mockPrisma.notificationSetting.findMany.mockResolvedValue(settings);

      const result = await service.getSettings('user-1');
      expect(result).toHaveLength(2);
    });

    it('should return defaults when no settings exist', async () => {
      mockPrisma.notificationSetting.findMany.mockResolvedValue([]);

      const result = await service.getSettings('user-1');

      expect(result).toHaveLength(8); // 8 default types
      expect(result.find((s: any) => s.type === 'meal_breakfast')?.enabled).toBe(true);
      expect(result.find((s: any) => s.type === 'promo')?.enabled).toBe(false);
    });
  });

  describe('updateSettings', () => {
    it('should upsert notification settings', async () => {
      mockPrisma.notificationSetting.upsert.mockResolvedValue({
        type: 'meal_breakfast', enabled: false, time: '08:00',
      });

      const result = await service.updateSettings('user-1', [
        { type: 'meal_breakfast', enabled: false, time: '08:00' },
      ]);

      expect(result).toHaveLength(1);
      expect(mockPrisma.notificationSetting.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId_type: { userId: 'user-1', type: 'meal_breakfast' } },
          update: { enabled: false, time: '08:00' },
          create: { userId: 'user-1', type: 'meal_breakfast', enabled: false, time: '08:00' },
        }),
      );
    });
  });

  // ==========================================
  // Create notification
  // ==========================================
  describe('create', () => {
    it('should create a notification', async () => {
      mockPrisma.notification.create.mockResolvedValue({
        id: 'n1', type: 'meal_suggestion', title: 'Gợi ý bữa trưa',
      });

      const result = await service.create('user-1', {
        type: 'meal_suggestion',
        title: 'Gợi ý bữa trưa',
        body: 'Hôm nay ăn phở nhé!',
      });

      expect(result.id).toBe('n1');
    });
  });

  // ==========================================
  // Delete notification
  // ==========================================
  describe('delete', () => {
    it('should delete a notification', async () => {
      mockPrisma.notification.findFirst.mockResolvedValue({ id: 'n1' });
      mockPrisma.notification.delete.mockResolvedValue({});

      await expect(service.delete('user-1', 'n1')).resolves.not.toThrow();
    });

    it('should throw 404 for another users notification', async () => {
      mockPrisma.notification.findFirst.mockResolvedValue(null);

      await expect(
        service.delete('user-1', 'not-mine'),
      ).rejects.toThrow('Notification không tìm thấy');
    });
  });
});
