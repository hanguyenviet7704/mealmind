import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { RedisService } from '../src/common/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    getJson: jest.fn(),
    setJson: jest.fn(),
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('mock-access-token'),
    verify: jest.fn(),
  };

  const mockConfig = {
    get: jest.fn((key: string, defaultVal?: string) => {
      const map: Record<string, string> = {
        JWT_ACCESS_SECRET: 'test-secret',
        JWT_ACCESS_EXPIRES_IN: '900',
        JWT_REFRESH_EXPIRES_IN: '604800',
      };
      return map[key] || defaultVal;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ==========================================
  // AUTH-002: Register
  // ==========================================
  describe('register', () => {
    it('should create a new user and return tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1', name: 'Test User', email: 'test@example.com',
        avatarUrl: null, subscriptionTier: 'free', onboardingCompleted: false, activeProfileId: null,
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' });

      const result = await service.register('Test User', 'test@example.com', 'Password1');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.isNewUser).toBe(true);
    });

    it('should throw EmailExistsException if email exists (409)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.register('Test', 'existing@example.com', 'Password1'),
      ).rejects.toThrow('Email đã được sử dụng');
    });
  });

  // ==========================================
  // AUTH-003: Login
  // ==========================================
  describe('login', () => {
    it('should login successfully and return tokens', async () => {
      const hash = await bcrypt.hash('Password1', 12);
      mockRedis.get.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', email: 'test@example.com', passwordHash: hash,
        name: 'Test', avatarUrl: null, subscriptionTier: 'free',
        onboardingCompleted: true, activeProfileId: null,
      });
      mockRedis.del.mockResolvedValue(null);
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' });

      const result = await service.login('test@example.com', 'Password1');

      expect(result.accessToken).toBeDefined();
      expect(result.isNewUser).toBe(false);
    });

    it('should throw InvalidCredentialsException for non-existent user (401)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockRedis.get.mockResolvedValue(null);

      await expect(
        service.login('nouser@example.com', 'password'),
      ).rejects.toThrow('Email hoặc mật khẩu không đúng');
    });

    it('should throw InvalidCredentialsException for wrong password (401)', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', email: 'test@example.com',
        passwordHash: await bcrypt.hash('CorrectPassword1', 12),
      });

      await expect(
        service.login('test@example.com', 'WrongPassword'),
      ).rejects.toThrow('Email hoặc mật khẩu không đúng');
    });

    it('should throw AccountLockedException after 5 failed attempts (429)', async () => {
      mockRedis.get.mockResolvedValue('5');

      await expect(
        service.login('locked@example.com', 'password'),
      ).rejects.toThrow('Tài khoản tạm khóa');
    });

    it('should increment login attempts on failure', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await service.login('test@example.com', 'wrong').catch(() => {});

      expect(mockRedis.set).toHaveBeenCalledWith(
        'login_attempts:test@example.com', expect.any(String), 900,
      );
    });
  });

  // ==========================================
  // AUTH-006: Refresh token
  // ==========================================
  describe('refreshToken', () => {
    it('should throw RefreshTokenRevokedException for revoked token', async () => {
      mockPrisma.refreshToken.findFirst.mockResolvedValue({
        id: 'rt-1', revokedAt: new Date(),
      });

      await expect(
        service.refreshToken('some-token'),
      ).rejects.toThrow('Phiên đã bị thu hồi');
    });

    it('should throw RefreshTokenExpiredException for expired token', async () => {
      mockPrisma.refreshToken.findFirst.mockResolvedValue({
        id: 'rt-1', revokedAt: null,
        expiresAt: new Date('2020-01-01'), // expired
      });

      await expect(
        service.refreshToken('expired-token'),
      ).rejects.toThrow('Vui lòng đăng nhập lại');
    });

    it('should rotate token (revoke old, issue new)', async () => {
      mockPrisma.refreshToken.findFirst.mockResolvedValue({
        id: 'rt-1', revokedAt: null, userId: 'user-1',
        expiresAt: new Date(Date.now() + 86400000),
      });
      mockPrisma.refreshToken.update.mockResolvedValue({});
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', email: 'test@example.com', name: 'Test',
        avatarUrl: null, subscriptionTier: 'free', onboardingCompleted: true,
        activeProfileId: null,
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-2' });

      const result = await service.refreshToken('valid-token');

      expect(result.accessToken).toBeDefined();
      // Old token should be revoked
      expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'rt-1' },
          data: { revokedAt: expect.any(Date) },
        }),
      );
    });
  });

  // ==========================================
  // AUTH-007: Logout
  // ==========================================
  describe('logout', () => {
    it('should revoke specific refresh token', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      await service.logout('user-1', 'some-token', false);

      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-1' }),
        }),
      );
    });

    it('should revoke all tokens when allDevices=true', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });

      await service.logout('user-1', undefined, true);

      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  // ==========================================
  // AUTH-008: Forgot password
  // ==========================================
  describe('forgotPassword', () => {
    it('should complete without error even if user not found (security)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.forgotPassword('notfound@example.com')).resolves.not.toThrow();
    });

    it('should store reset token in Redis with 1h TTL', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'test@example.com' });
      mockRedis.set.mockResolvedValue(null);

      await service.forgotPassword('test@example.com');

      expect(mockRedis.set).toHaveBeenCalledWith(
        expect.stringContaining('reset:'), 'user-1', 3600,
      );
    });
  });

  // ==========================================
  // AUTH-009: Reset password
  // ==========================================
  describe('resetPassword', () => {
    it('should update password and revoke all tokens', async () => {
      mockRedis.get.mockResolvedValue('user-1');
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });
      mockRedis.del.mockResolvedValue(null);

      await service.resetPassword('valid-token', 'NewPassword1');

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: { passwordHash: expect.any(String) },
        }),
      );
      // All tokens revoked
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalled();
      // Reset token deleted
      expect(mockRedis.del).toHaveBeenCalled();
    });

    it('should throw ResetTokenInvalidException for expired/invalid token', async () => {
      mockRedis.get.mockResolvedValue(null);

      await expect(
        service.resetPassword('invalid-token', 'Password1'),
      ).rejects.toThrow('Link đặt lại mật khẩu không hợp lệ');
    });
  });

  // ==========================================
  // AUTH-010: Get me
  // ==========================================
  describe('getMe', () => {
    it('should return user summary', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', name: 'Test', email: 'test@example.com',
        avatarUrl: null, subscriptionTier: 'free', onboardingCompleted: true,
      });

      const result = await service.getMe('user-1');
      expect(result.id).toBe('user-1');
      expect(result.tier).toBe('free');
    });

    it('should throw for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe('nonexistent')).rejects.toThrow(
        'Email hoặc mật khẩu không đúng',
      );
    });
  });

  // ==========================================
  // G1: Change Password
  // ==========================================
  describe('changePassword', () => {
    it('should change password and revoke sessions', async () => {
      const hash = await bcrypt.hash('OldPassword1', 12);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', passwordHash: hash,
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      await expect(
        service.changePassword('user-1', 'OldPassword1', 'NewPassword1'),
      ).resolves.not.toThrow();

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { passwordHash: expect.any(String) },
        }),
      );
    });

    it('should throw PasswordMismatchException for wrong current password', async () => {
      const hash = await bcrypt.hash('CorrectPassword', 12);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', passwordHash: hash,
      });

      await expect(
        service.changePassword('user-1', 'WrongCurrent', 'NewPassword1'),
      ).rejects.toThrow('Mật khẩu hiện tại không đúng');
    });

    it('should throw OAuthOnlyAccountException for OAuth-only user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', passwordHash: null, // OAuth only
      });

      await expect(
        service.changePassword('user-1', 'anything', 'NewPassword1'),
      ).rejects.toThrow('Tài khoản chỉ dùng OAuth');
    });
  });

  // ==========================================
  // G2: Delete Account
  // ==========================================
  describe('deleteAccount', () => {
    it('should soft-delete account and revoke all tokens', async () => {
      const hash = await bcrypt.hash('Password1', 12);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', passwordHash: hash,
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });

      await service.deleteAccount('user-1', 'Password1');

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { deletedAt: expect.any(Date) },
        }),
      );
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalled();
    });

    it('should throw PasswordMismatchException for wrong password', async () => {
      const hash = await bcrypt.hash('CorrectPass1', 12);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', passwordHash: hash,
      });

      await expect(
        service.deleteAccount('user-1', 'WrongPass'),
      ).rejects.toThrow('Mật khẩu hiện tại không đúng');
    });

    it('should allow OAuth-only users to delete without password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', passwordHash: null, // OAuth only
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      await expect(
        service.deleteAccount('user-1', ''),
      ).resolves.not.toThrow();
    });
  });
});
