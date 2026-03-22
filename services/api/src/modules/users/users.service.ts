import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ResourceNotFoundException } from '@/common/exceptions';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new ResourceNotFoundException('User');
    return user;
  }

  // G3: Update user profile (name, avatar)
  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ResourceNotFoundException('User');

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
      select: {
        id: true, name: true, email: true, avatarUrl: true,
        subscriptionTier: true, onboardingCompleted: true,
      },
    });
  }

  async updateActiveProfile(userId: string, profileId: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { activeProfileId: profileId },
    });
  }

  async completeOnboarding(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    });
  }
}

