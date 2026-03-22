import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  InvalidCredentialsException,
  EmailExistsException,
  RefreshTokenExpiredException,
  RefreshTokenRevokedException,
  ResetTokenInvalidException,
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

    const tokens = await this.generateTokens(user.id, user.email, user.subscriptionTier, user.activeProfileId);

    return {
      ...tokens,
      user: this.toUserSummary(user),
      isNewUser: true,
    };
  }

  // ---- AUTH-003: Login ----
  async login(email: string, password: string, rememberMe: boolean = false) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) throw new InvalidCredentialsException();

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsException();

    const refreshTtl = rememberMe ? 30 * 24 * 3600 : this.REFRESH_TTL;
    const tokens = await this.generateTokens(user.id, user.email, user.subscriptionTier, user.activeProfileId, refreshTtl);

    return {
      ...tokens,
      user: this.toUserSummary(user),
      isNewUser: false,
    };
  }

  // ---- AUTH-004: Google OAuth ----
  async googleAuth(idToken: string) {
    const payload = this.decodeGoogleToken(idToken);
    if (!payload) throw new OAuthFailedException();

    let user = await this.prisma.user.findUnique({ where: { googleId: payload.sub } });
    let isNewUser = false;

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email: payload.email } });
      if (user) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: payload.sub, avatarUrl: user.avatarUrl || payload.picture },
        });
      } else {
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
    const appleUserId = this.decodeAppleToken(identityToken);
    if (!appleUserId) throw new OAuthFailedException();

    let user = await this.prisma.user.findUnique({ where: { appleId: appleUserId } });
    let isNewUser = false;

    if (!user) {
      if (email) {
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

  // ---- AUTH-008: Forgot Password (token logged to console only) ----
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
  }

  // ---- AUTH-009: Reset Password (disabled without Redis) ----
  async resetPassword(_token: string, _newPassword: string) {
    throw new ResetTokenInvalidException();
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

    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ---- G2: Delete Account ----
  async deleteAccount(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new InvalidCredentialsException();

    if (user.passwordHash) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) throw new PasswordMismatchException();
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

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
