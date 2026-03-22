import { Controller, Post, Get, Patch, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Post('quiz')
  @HttpCode(HttpStatus.CREATED)
  async submitQuiz(@CurrentUser('sub') userId: string, @Body() body: any) {
    return this.onboardingService.submitQuiz(userId, body);
  }

  @Get('quiz/progress')
  async getQuizProgress(@CurrentUser('sub') userId: string) {
    return this.onboardingService.getQuizProgress(userId);
  }

  @Patch('quiz/:step')
  async saveQuizStep(
    @CurrentUser('sub') userId: string,
    @Param('step') step: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.onboardingService.saveQuizStep(userId, parseInt(step), body);
  }

  @Post('skip')
  @HttpCode(HttpStatus.CREATED)
  async skipQuiz(@CurrentUser('sub') userId: string) {
    return this.onboardingService.skipQuiz(userId);
  }
}
