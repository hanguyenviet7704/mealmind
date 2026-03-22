import { Suspense } from 'react';
import OnboardingWizard from '@/features/onboarding/components/OnboardingWizard';

export const metadata = { title: 'Khảo sát sở thích — MealMind' };

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <OnboardingWizard />
    </Suspense>
  );
}
