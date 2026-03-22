'use client';

import { Check } from 'lucide-react';

interface Step1RegionProps {
  selected: string[];
  onChange: (regions: string[]) => void;
}

const regions = [
  { id: 'north', name: 'Miền Bắc', description: 'Phở, bún chả, nem', emoji: '🍜' },
  { id: 'central', name: 'Miền Trung', description: 'Bún bò, mì Quảng', emoji: '🥘' },
  { id: 'south', name: 'Miền Nam', description: 'Cơm tấm, hủ tiếu', emoji: '🍚' },
  { id: 'international', name: 'Quốc tế', description: 'Nhật, Hàn, Ý, Thái', emoji: '🍱' },
];

export default function Step1Region({ selected, onChange }: Step1RegionProps) {
  const toggleRegion = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((r) => r !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-2">Bạn thích ẩm thực vùng nào?</h2>
        <p className="text-stone-600">Chọn một hoặc nhiều vùng miền</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => toggleRegion(region.id)}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md text-left ${
              selected.includes(region.id)
                ? 'border-orange-500 bg-orange-50'
                : 'border-stone-200 hover:border-orange-300 bg-white'
            }`}
          >
            <div className="text-center">
              <div className="text-5xl mb-3">{region.emoji}</div>
              <h3 className="font-semibold text-stone-800 mb-1">{region.name}</h3>
              <p className="text-sm text-stone-600">{region.description}</p>
            </div>
            {selected.includes(region.id) && (
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
