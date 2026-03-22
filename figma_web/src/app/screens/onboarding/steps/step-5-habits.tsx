import { Minus, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface Step5HabitsProps {
  maxCookTime: string;
  familySize: number;
  cookingSkill: string;
  onChange: (values: { maxCookTime?: string; familySize?: number; cookingSkill?: string }) => void;
}

const cookTimes = [
  { id: 'under_15', label: '< 15\nphút' },
  { id: 'fifteen_to_30', label: '15-30\nphút' },
  { id: 'thirty_to_60', label: '30-60\nphút' },
  { id: 'over_60', label: '> 60\nphút' },
];

const skills = [
  { id: 'beginner', label: 'Mới bắt đầu', emoji: '🔰' },
  { id: 'intermediate', label: 'Cơ bản', emoji: '👨‍🍳' },
  { id: 'advanced', label: 'Thành thạo', emoji: '⭐' },
];

export default function Step5Habits({ maxCookTime, familySize, cookingSkill, onChange }: Step5HabitsProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-2">
          Thói quen nấu ăn của bạn?
        </h2>
      </div>

      {/* Cook Time */}
      <div className="space-y-4">
        <h3 className="font-semibold text-stone-800 text-center pb-2 border-b border-stone-200">
          Thời gian nấu tối đa
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {cookTimes.map((time) => (
            <button
              key={time.id}
              onClick={() => onChange({ maxCookTime: time.id })}
              className={`
                p-4 rounded-lg border-2 transition-all whitespace-pre-line
                ${maxCookTime === time.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-stone-200 hover:border-stone-300'
                }
              `}
            >
              <div className="text-sm font-medium text-stone-800 text-center">
                {time.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Family Size */}
      <div className="space-y-4">
        <h3 className="font-semibold text-stone-800 text-center pb-2 border-b border-stone-200">
          Gia đình bạn có mấy người?
        </h3>
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onChange({ familySize: Math.max(1, familySize - 1) })}
            disabled={familySize <= 1}
            className="w-12 h-12 rounded-full"
          >
            <Minus className="w-5 h-5" />
          </Button>
          <span className="text-4xl font-semibold text-stone-800 w-20 text-center">
            {familySize}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onChange({ familySize: Math.min(20, familySize + 1) })}
            disabled={familySize >= 20}
            className="w-12 h-12 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-sm text-stone-600 text-center">
          Chúng tôi sẽ gợi ý khẩu phần phù hợp
        </p>
      </div>

      {/* Cooking Skill */}
      <div className="space-y-4">
        <h3 className="font-semibold text-stone-800 text-center pb-2 border-b border-stone-200">
          Trình độ nấu ăn
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => onChange({ cookingSkill: skill.id })}
              className={`
                p-6 rounded-lg border-2 transition-all
                ${cookingSkill === skill.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-stone-200 hover:border-stone-300'
                }
              `}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{skill.emoji}</div>
                <div className="text-sm font-medium text-stone-800">{skill.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
