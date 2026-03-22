import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/modules/users/users.service';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  // ==========================================
  // findById
  // ==========================================
  describe('findById', () => {
    it('should return user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', name: 'Test', email: 'test@example.com',
      });

      const result = await service.findById('user-1');
      expect(result.id).toBe('user-1');
    });

    it('should throw ResourceNotFoundException', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        'User không tìm thấy',
      );
    });
  });

  // ==========================================
  // G3: Update Profile
  // ==========================================
  describe('updateProfile', () => {
    it('should update name', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-1', name: 'New Name', email: 'test@example.com',
        avatarUrl: null, subscriptionTier: 'free', onboardingCompleted: true,
      });

      const result = await service.updateProfile('user-1', { name: 'New Name' });
      expect(result.name).toBe('New Name');
    });

    it('should update avatarUrl', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-1', name: 'Test', avatarUrl: 'https://cdn.example.com/avatar.jpg',
        email: 'test@example.com', subscriptionTier: 'free', onboardingCompleted: true,
      });

      const result = await service.updateProfile('user-1', {
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
      });
      expect(result.avatarUrl).toBe('https://cdn.example.com/avatar.jpg');
    });

    it('should throw ResourceNotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProfile('nonexistent', { name: 'Test' }),
      ).rejects.toThrow('User không tìm thấy');
    });
  });

  // ==========================================
  // updateActiveProfile
  // ==========================================
  describe('updateActiveProfile', () => {
    it('should update active profile', async () => {
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-1', activeProfileId: 'profile-2',
      });

      const result = await service.updateActiveProfile('user-1', 'profile-2');
      expect(result.activeProfileId).toBe('profile-2');
    });

    it('should set active profile to null (family mode)', async () => {
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-1', activeProfileId: null,
      });

      const result = await service.updateActiveProfile('user-1', null);
      expect(result.activeProfileId).toBeNull();
    });
  });

  // ==========================================
  // completeOnboarding
  // ==========================================
  describe('completeOnboarding', () => {
    it('should set onboardingCompleted to true', async () => {
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-1', onboardingCompleted: true,
      });

      const result = await service.completeOnboarding('user-1');
      expect(result.onboardingCompleted).toBe(true);
    });
  });
});
