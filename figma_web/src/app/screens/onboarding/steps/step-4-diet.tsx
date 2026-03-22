import { Card } from '../../../components/ui/card';
import { Check } from 'lucide-react';

interface Step4DietProps {
  selected: string;
  onChange: (dietType: string) => void;
}

const dietTypes = [
  {
    id: 'normal',
    name: 'Bình thường',
    description: 'Không giới hạn nguyên liệu',
  },
  {
    id: 'lacto_ovo_vegetarian',
    name: 'Chay (trứng + sữa)',
    description: 'Không thịt, không cá. OK trứng và sữa',
  },
  {
    id: 'vegan',
    name: 'Thuần chay (Vegan)',
    description: 'Không sản phẩm động vật',
  },
  {
    id: 'keto',
    name: 'Keto',
    description: '< 20g carb/ngày, nhiều chất béo lành mạnh',
  },
  {
    id: 'low_carb',
    name: 'Low-carb',
    description: '< 100g carb/ngày',
  },
  {
    id: 'paleo',
    name: 'Paleo',
    description: 'Không ngũ cốc, sữa, đậu, đường tinh luyện',
  },
];

export default function Step4Diet({ selected, onChange }: Step4DietProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-2">
          Chế độ ăn đặc biệt?
        </h2>
        <p className="text-stone-600">Chọn một chế độ phù hợp</p>
      </div>

      <div className="space-y-3">
        {dietTypes.map((diet) => (
          <Card
            key={diet.id}
            onClick={() => onChange(diet.id)}
            className={`
              relative p-4 cursor-pointer transition-all hover:shadow-md
              ${selected === diet.id
                ? 'border-orange-500 border-2 bg-orange-50'
                : 'border-stone-200 hover:border-orange-300'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                ${selected === diet.id ? 'border-orange-500' : 'border-stone-300'}
              `}>
                {selected === diet.id && (
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-stone-800 mb-1">{diet.name}</h3>
                <p className="text-sm text-stone-600">{diet.description}</p>
              </div>
              {selected === diet.id && (
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
