'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import Step1Region from './steps/Step1Region';
import Step2Taste from './steps/Step2Taste';
import Step3Allergies from './steps/Step3Allergies';
import Step4Diet from './steps/Step4Diet';
import Step5Habits from './steps/Step5Habits';

export default function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get('step') || '1');

  const [formData, setFormData] = useState({
    regions: [] as string[],
    spiceLevel: 3,
    sweetLevel: 3,
    saltLevel: 3,
    allergens: [] as string[],
    customAllergens: [] as string[],
    dietType: 'normal',
    maxCookTime: 'thirty_to_60',
    familySize: 2,
    cookingSkill: 'intermediate',
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.regions.length > 0;
      default: return true;
    }
  };

  const setStep = (step: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('step', step.toString());
    router.push(url.pathname + url.search);
  };

  const handleNext = () => {
    if (!isStepValid()) {
      toast.error('Vui lòng hoàn thành bước này');
      return;
    }
    if (currentStep < totalSteps) {
      setStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setStep(currentStep - 1);
  };

  const handleSkip = async () => {
    try {
      await apiClient('/onboarding/skip', { method: 'POST' });
    } catch {
      // skip gracefully even if API fails
    }
    toast.info('Đã bỏ qua onboarding');
    router.push('/home');
  };

  const handleComplete = async () => {
    try {
      await apiClient('/onboarding/quiz', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      toast.success('Thiết lập hoàn tất! Chào mừng đến MealMind 🎉');
      setTimeout(() => router.push('/home'), 500);
    } catch (err: any) {
      toast.error(err?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Region selected={formData.regions} onChange={(regions) => setFormData({ ...formData, regions })} />;
      case 2: return <Step2Taste spiceLevel={formData.spiceLevel} sweetLevel={formData.sweetLevel} saltLevel={formData.saltLevel} onChange={(v) => setFormData({ ...formData, ...v })} />;
      case 3: return <Step3Allergies allergens={formData.allergens} customAllergens={formData.customAllergens} onChange={(v) => setFormData({ ...formData, ...v })} />;
      case 4: return <Step4Diet selected={formData.dietType} onChange={(dietType) => setFormData({ ...formData, dietType })} />;
      case 5: return <Step5Habits maxCookTime={formData.maxCookTime} familySize={formData.familySize} cookingSkill={formData.cookingSkill} onChange={(v) => setFormData({ ...formData, ...v })} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="bg-white border-b border-stone-200 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-600">Bước {currentStep}/{totalSteps}</span>
            <span className="text-sm text-stone-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">{renderStep()}</div>
      </div>

      <div className="bg-white border-t border-stone-200 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={handleSkip} className="text-stone-600">Bỏ qua</Button>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ChevronLeft className="w-5 h-5" /> Trước
              </Button>
            )}
            <Button onClick={handleNext} disabled={!isStepValid()} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
              {currentStep === totalSteps ? 'Hoàn thành' : 'Tiếp'}
              {currentStep < totalSteps && <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
