'use client';

interface Step5HabitsProps {
  maxCookTime: string;
  familySize: number;
  cookingSkill: string;
  onChange: (values: { maxCookTime?: string; familySize?: number; cookingSkill?: string }) => void;
}

const cookTimes = [
  { id: 'under_15', label: 'Dưới 15 phút', emoji: '⚡' },
  { id: 'fifteen_to_30', label: '15 - 30 phút', emoji: '🕐' },
  { id: 'thirty_to_60', label: '30 - 60 phút', emoji: '🕑' },
  { id: 'over_60', label: 'Trên 60 phút', emoji: '🕒' },
];

const skills = [
  { id: 'beginner', label: 'Mới bắt đầu', emoji: '🌱' },
  { id: 'intermediate', label: 'Biết nấu cơ bản', emoji: '👨‍🍳' },
  { id: 'advanced', label: 'Nấu giỏi', emoji: '⭐' },
];

export default function Step5Habits({ maxCookTime, familySize, cookingSkill, onChange }: Step5HabitsProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-2">Thói quen nấu ăn</h2>
        <p className="text-stone-600">Để gợi ý phù hợp hơn</p>
      </div>

      {/* Cook time */}
      <div>
        <h3 className="font-semibold text-stone-800 mb-4">Thời gian nấu tối đa?</h3>
        <div className="grid grid-cols-2 gap-3">
          {cookTimes.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ maxCookTime: t.id })}
              className={`p-4 rounded-lg border-2 transition-all ${
                maxCookTime === t.id ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <span className="text-2xl">{t.emoji}</span>
              <div className="text-sm font-medium text-stone-800 mt-2">{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Family size */}
      <div>
        <h3 className="font-semibold text-stone-800 mb-4">Số người ăn?</h3>
        <div className="flex items-center gap-4 justify-center">
          <button onClick={() => onChange({ familySize: Math.max(1, familySize - 1) })} className="w-12 h-12 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-2xl font-bold text-stone-600 transition-colors">−</button>
          <span className="text-4xl font-bold text-stone-800 w-16 text-center">{familySize}</span>
          <button onClick={() => onChange({ familySize: familySize + 1 })} className="w-12 h-12 rounded-full bg-orange-100 hover:bg-orange-200 flex items-center justify-center text-2xl font-bold text-orange-600 transition-colors">+</button>
        </div>
      </div>

      {/* Cooking skill */}
      <div>
        <h3 className="font-semibold text-stone-800 mb-4">Trình độ nấu ăn?</h3>
        <div className="grid grid-cols-3 gap-3">
          {skills.map((s) => (
            <button
              key={s.id}
              onClick={() => onChange({ cookingSkill: s.id })}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                cookingSkill === s.id ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <div className="text-sm font-medium text-stone-800 mt-2">{s.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
