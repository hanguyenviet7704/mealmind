import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import {
  InvalidCredentialsException,
  EmailExistsException,
  RefreshTokenExpiredException,
  RefreshTokenRevokedException,
  ResetTokenInvalidException,
  AccountLockedException,
  OAuthFailedException,
  PasswordMismatchException,
  OAuthOnlyAccountException,
} from '@/common/exceptions';

interface JwtPayload {
  sub: string;
  email: string;
  tier: string;
  activeProfileId: string | null;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly ACCESS_TTL: number;
  private readonly REFRESH_TTL: number;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private redis: RedisService,
  ) {
    this.ACCESS_TTL = parseInt(this.config.get('JWT_ACCESS_EXPIRES_IN', '900'));
    this.REFRESH_TTL = parseInt(this.config.get('JWT_REFRESH_EXPIRES_IN', '604800'));
  }

  // ---- AUTH-002: Register ----
  async register(name: string, email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new EmailExistsException();

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: { name, email, passwordHash },
    });

    // Auto-login after register
    const tokens = await this.generateTokens(user.id, user.email, user.subscriptionTier, user.activeProfileId);

    return {
      ...tokens,
      user: this.toUserSummary(user),
      isNewUser: true,
    };
  }

  // ---- AUTH-003: Login ----
  async login(email: string, password: string, rememberMe: boolean = false) {
    // Check rate limit
    await this.checkLoginRateLimit(email);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      await this.incrementLoginAttempts(email);
      throw new InvalidCredentialsException();
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      await this.incrementLoginAttempts(email);
      throw new InvalidCredentialsException();
    }

    // Reset login attempts on success
    await this.redis.del(`login_attempts:${email}`);

    const refreshTtl = rememberMe ? 30 * 24 * 3600 : this.REFRESH_TTL; // 30 days vs 7 days
    const tokens = await this.generateTokens(user.id, user.email, user.subscriptionTier, user.activeProfileId, refreshTtl);

    return {
      ...tokens,
      user: this.toUserSummary(user),
      isNewUser: false,
    };
  }

  // ---- AUTH-004: Google OAuth ----
  async googleAuth(idToken: string) {
    // In production: verify idToken with Google APIs
    // For now: decode and trust (placeholder)
    const payload = this.decodeGoogleToken(idToken);
    if (!payload) throw new OAuthFailedException();

    let user = await this.prisma.user.findUnique({ where: { googleId: payload.sub } });
    let isNewUser = false;

    if (!user) {
      // Check if email exists (link accounts per BR-AUTH-06)
      user = await this.prisma.user.findUnique({ where: { email: payload.email } });
      if (user) {
        // Link Google account
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: payload.sub, avatarUrl: user.avatarUrl || payload.picture },
        });
      } else {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name,
            googleId: payload.sub,
            avatarUrl: payload.picture,
          },
        });
        isNewUser = true;
      }
    }

    const tokens = await this.generateTokens(user.id, user.email, user.subscriptionTier, user.activeProfileId);
    return { ...tokens, user: this.toUserSummary(user), isNewUser };
  }

  // ---- AUTH-005: Apple Sign In ----
  async appleAuth(identityToken: string, _authorizationCode: string, fullName?: { givenName?: string; familyName?: string }, email?: string) {
    // In production: verify identityToken with Apple
    const appleUserId = this.decodeAppleToken(identityToken);
    if (!appleUserId) throw new OAuthFailedException();

    let user = await this.prisma.user.findUnique({ where: { appleId: appleUserId } });
    let isNewUser = false;

    if (!user) {
      if (email) {
        // Check email link (BR-AUTH-06)
        user = await this.prisma.user.findUnique({ where: { email } });
        if (user) {
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { appleId: appleUserId },
          });
        }
      }

      if (!user) {
        const name = fullName
          ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
          : 'Apple User';

        user = await this.prisma.user.create({
          data: {
            email: email || `${appleUserId}@privaterelay.appleid.com`,
            name,
            appleId: appleUserId,
          },
        });
        isNewUser = true;
      }
    }

    const tokens = await this.generateTokens(user.id, user.email, user.subscriptionTier, user.activeProfileId);
    return { ...tokens, user: this.toUserSummary(user), isNewUser };
  }

  // ---- AUTH-006: Refresh Token ----
  async refreshToken(rawRefreshToken: string) {
    const tokenHash = this.hashToken(rawRefreshToken);

    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (!stored) throw new RefreshTokenRevokedException();
    if (stored.revokedAt) throw new RefreshTokenRevokedException();
    if (stored.expiresAt < new Date()) throw new RefreshTokenExpiredException();

    // Revoke old token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw new RefreshTokenRevokedException();

    const tokens = await this.generateTokens(user.id, user.email, user.subscriptionTier, user.activeProfileId);
    return { ...tokens, user: this.toUserSummary(user), isNewUser: false };
  }

  // ---- AUTH-007: Logout ----
  async logout(userId: string, refreshToken?: string, allDevices: boolean = false) {
    if (allDevices) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash, userId },
        data: { revokedAt: new Date() },
      });
    }
  }

  // ---- AUTH-008: Forgot Password ----
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always return success (security: don't reveal if email exists)
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetHash = this.hashToken(resetToken);

    // Store reset token in Redis with 1 hour TTL
    await this.redis.set(`reset:${resetHash}`, user.id, 3600);

    // TODO: Send email with reset link containing resetToken
    // For now, log it
    console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
  }

  // ---- AUTH-009: Reset Password ----
  async resetPassword(token: string, newPassword: string) {
    const tokenHash = this.hashToken(token);
    const userId = await this.redis.get(`reset:${tokenHash}`);

    if (!userId) throw new ResetTokenInvalidException();

    const passwordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Revoke all refresh tokens (force logout everywhere)
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    // Delete reset token
    await this.redis.del(`reset:${tokenHash}`);
  }

  // ---- AUTH-010: Get current user ----
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new InvalidCredentialsException();
    return this.toUserSummary(user);
  }

  // ---- G1: Change Password ----
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new InvalidCredentialsException();
    if (!user.passwordHash) throw new OAuthOnlyAccountException();

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new PasswordMismatchException();

    const passwordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Revoke all other sessions
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ---- G2: Delete Account (soft delete, 30-day grace) ----
  async deleteAccount(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new InvalidCredentialsException();

    // Verify password (if OAuth-only, skip password check)
    if (user.passwordHash) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) throw new PasswordMismatchException();
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    // Revoke all tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ---- Helpers ----
  private async generateTokens(
    userId: string,
    email: string,
    tier: string,
    activeProfileId: string | null,
    refreshTtlOverride?: number,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: userId, email, tier, activeProfileId };
    const accessToken = this.jwt.sign(payload);

    const rawRefreshToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);
    const refreshTtl = refreshTtlOverride || this.REFRESH_TTL;

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + refreshTtl * 1000),
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: this.ACCESS_TTL,
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private toUserSummary(user: { id: string; name: string; email: string; avatarUrl: string | null; subscriptionTier: string; onboardingCompleted: boolean }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      tier: user.subscriptionTier,
      onboardingCompleted: user.onboardingCompleted,
    };
  }

  // Rate limiting helpers
  private async checkLoginRateLimit(email: string) {
    const key = `login_attempts:${email}`;
    const attempts = await this.redis.get(key);
    if (attempts && parseInt(attempts) >= 5) {
      throw new AccountLockedException();
    }
  }

  private async incrementLoginAttempts(email: string) {
    const key = `login_attempts:${email}`;
    const current = await this.redis.get(key);
    const count = current ? parseInt(current) + 1 : 1;
    await this.redis.set(key, count.toString(), 900); // 15 min TTL
  }

  // OAuth token decoders (placeholder — use real verification in production)
  private decodeGoogleToken(idToken: string): { sub: string; email: string; name: string; picture: string } | null {
    try {
      const parts = idToken.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(Buffer.from(parts[1], 'base64').toString());
    } catch {
      return null;
    }
  }

  private decodeAppleToken(identityToken: string): string | null {
    try {
      const parts = identityToken.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      return payload.sub || null;
    } catch {
      return null;
    }
  }
}
