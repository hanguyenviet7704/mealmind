import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { TasteProfilesController } from './taste-profiles.controller';
import { FamilyProfilesController } from './family-profiles.controller';

@Module({
  controllers: [OnboardingController, TasteProfilesController, FamilyProfilesController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
