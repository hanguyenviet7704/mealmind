import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { toast } from 'sonner';
import Step1Region from './steps/step-1-region';
import Step2Taste from './steps/step-2-taste';
import Step3Allergies from './steps/step-3-allergies';
import Step4Diet from './steps/step-4-diet';
import Step5Habits from './steps/step-5-habits';

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
      case 1:
        return formData.regions.length > 0;
      case 2:
        return true; // Always valid (has defaults)
      case 3:
        return true; // Can be empty
      case 4:
        return true; // Always valid (has default)
      case 5:
        return true; // Always valid (has defaults)
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      toast.error('Vui lòng hoàn thành bước này');
      return;
    }

    if (currentStep < totalSteps) {
      setSearchParams({ step: (currentStep + 1).toString() });
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setSearchParams({ step: (currentStep - 1).toString() });
    }
  };

  const handleSkip = () => {
    localStorage.setItem('mealmind_onboarding_completed', 'true');
    toast.info('Đã bỏ qua onboarding');
    navigate('/home');
  };

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem('mealmind_onboarding_data', JSON.stringify(formData));
    localStorage.setItem('mealmind_onboarding_completed', 'true');
    toast.success('Hoàn thành!');
    
    // Show success animation briefly then navigate
    setTimeout(() => {
      navigate('/home');
    }, 1500);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Region
            selected={formData.regions}
            onChange={(regions) => setFormData({ ...formData, regions })}
          />
        );
      case 2:
        return (
          <Step2Taste
            spiceLevel={formData.spiceLevel}
            sweetLevel={formData.sweetLevel}
            saltLevel={formData.saltLevel}
            onChange={(values) => setFormData({ ...formData, ...values })}
          />
        );
      case 3:
        return (
          <Step3Allergies
            allergens={formData.allergens}
            customAllergens={formData.customAllergens}
            onChange={(values) => setFormData({ ...formData, ...values })}
          />
        );
      case 4:
        return (
          <Step4Diet
            selected={formData.dietType}
            onChange={(dietType) => setFormData({ ...formData, dietType })}
          />
        );
      case 5:
        return (
          <Step5Habits
            maxCookTime={formData.maxCookTime}
            familySize={formData.familySize}
            cookingSkill={formData.cookingSkill}
            onChange={(values) => setFormData({ ...formData, ...values })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Progress Bar */}
      <div className="bg-white border-b border-stone-200 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-600">
              Bước {currentStep}/{totalSteps}
            </span>
            <span className="text-sm text-stone-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          {renderStep()}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-stone-200 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-stone-600"
          >
            Bỏ qua
          </Button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Trước
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
            >
              {currentStep === totalSteps ? 'Hoàn thành' : 'Tiếp'}
              {currentStep < totalSteps && <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
