import { useState } from 'react';
import { Check } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';

interface Step3AllergiesProps {
  allergens: string[];
  customAllergens: string[];
  onChange: (values: { allergens: string[]; customAllergens: string[] }) => void;
}

const commonAllergens = [
  { id: 'shellfish', name: 'Hải sản', emoji: '🦐' },
  { id: 'fish', name: 'Cá', emoji: '🐟' },
  { id: 'peanuts', name: 'Đậu phộng', emoji: '🥜' },
  { id: 'gluten', name: 'Gluten', emoji: '🌾' },
  { id: 'dairy', name: 'Sữa', emoji: '🥛' },
  { id: 'eggs', name: 'Trứng', emoji: '🥚' },
  { id: 'soy', name: 'Đậu nành', emoji: '🫘' },
  { id: 'tree_nuts', name: 'Hạt cây', emoji: '🌰' },
];

export default function Step3Allergies({ allergens, customAllergens, onChange }: Step3AllergiesProps) {
  const [customInput, setCustomInput] = useState('');

  const toggleAllergen = (id: string) => {
    if (allergens.includes(id)) {
      onChange({ allergens: allergens.filter((a) => a !== id), customAllergens });
    } else {
      onChange({ allergens: [...allergens, id], customAllergens });
    }
  };

  const addCustomAllergen = () => {
    if (customInput.trim() && !customAllergens.includes(customInput.trim())) {
      onChange({ allergens, customAllergens: [...customAllergens, customInput.trim()] });
      setCustomInput('');
    }
  };

  const removeCustomAllergen = (item: string) => {
    onChange({ allergens, customAllergens: customAllergens.filter((a) => a !== item) });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-2">
          Bạn có dị ứng thực phẩm nào?
        </h2>
        <p className="text-stone-600">Bỏ qua nếu không có</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {commonAllergens.map((allergen) => (
          <button
            key={allergen.id}
            onClick={() => toggleAllergen(allergen.id)}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${allergens.includes(allergen.id)
                ? 'border-orange-500 bg-orange-50'
                : 'border-stone-200 hover:border-stone-300'
              }
            `}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{allergen.emoji}</div>
              <div className="text-sm font-medium text-stone-800">{allergen.name}</div>
              {allergens.includes(allergen.id) && (
                <Check className="w-4 h-4 text-orange-500 mx-auto mt-2" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="pt-6">
        <div className="flex gap-2">
          <Input
            placeholder="Nhập nguyên liệu khác..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomAllergen();
              }
            }}
            className="flex-1"
          />
          <button
            onClick={addCustomAllergen}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Thêm
          </button>
        </div>

        {customAllergens.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {customAllergens.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="px-3 py-1 cursor-pointer hover:bg-stone-300"
                onClick={() => removeCustomAllergen(item)}
              >
                {item} ✕
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
