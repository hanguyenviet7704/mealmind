'use client';

import { Check } from 'lucide-react';

interface Step4DietProps {
  selected: string;
  onChange: (dietType: string) => void;
}

const diets = [
  { id: 'normal', name: 'Bình thường', description: 'Ăn đầy đủ các loại', emoji: '🍽️' },
  { id: 'vegetarian', name: 'Chay', description: 'Không thịt, cá', emoji: '🥬' },
  { id: 'keto', name: 'Keto', description: 'Ít carb, nhiều chất béo', emoji: '🥑' },
  { id: 'low_carb', name: 'Low-carb', description: 'Giảm tinh bột', emoji: '🥗' },
];

export default function Step4Diet({ selected, onChange }: Step4DietProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-2">Chế độ ăn của bạn?</h2>
        <p className="text-stone-600">Chọn một chế độ phù hợp</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {diets.map((diet) => (
          <button
            key={diet.id}
            onClick={() => onChange(diet.id)}
            className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-md text-left ${
              selected === diet.id ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:border-orange-300 bg-white'
            }`}
          >
            <div className="text-center">
              <div className="text-5xl mb-3">{diet.emoji}</div>
              <h3 className="font-semibold text-stone-800 mb-1">{diet.name}</h3>
              <p className="text-sm text-stone-600">{diet.description}</p>
            </div>
            {selected === diet.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
