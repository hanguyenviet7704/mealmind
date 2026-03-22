import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, RefreshCw, Check, Clock, Flame } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Badge } from '../../components/ui/badge';

const mockCombo = {
  mealType: 'lunch',
  servings: 2,
  totalCalories: 1050,
  totalTime: 105,
  dishes: [
    {
      role: 'main',
      label: 'Món chính',
      recipe: {
        id: 1,
        name: 'Cá kho tộ',
        imageUrl: 'https://images.unsplash.com/photo-1597345637412-9fd611e758f3?w=400',
        cookTime: 40,
        calories: 380,
        cuisine: 'Miền Nam',
      },
    },
    {
      role: 'soup',
      label: 'Canh',
      recipe: {
        id: 2,
        name: 'Canh chua cá lóc',
        imageUrl: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?w=400',
        cookTime: 25,
        calories: 180,
        cuisine: 'Miền Nam',
      },
    },
    {
      role: 'vegetable',
      label: 'Rau',
      recipe: {
        id: 3,
        name: 'Rau muống xào tỏi',
        imageUrl: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?w=400',
        cookTime: 10,
        calories: 120,
        cuisine: 'Miền Nam',
      },
    },
    {
      role: 'dessert',
      label: 'Tráng miệng',
      recipe: {
        id: 4,
        name: 'Chè đậu xanh',
        imageUrl: 'https://images.unsplash.com/photo-1707535347953-6cf5a129d55c?w=400',
        cookTime: 30,
        calories: 150,
        cuisine: 'Miền Nam',
      },
    },
  ],
};

export default function ComboScreen() {
  const [combo] = useState(mockCombo);

  return (
    <div className="min-h-screen bg-stone-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 text-stone-600 hover:text-stone-800">
            <ChevronLeft className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <h1 className="text-lg font-semibold text-stone-800">Combo bữa trưa</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold text-stone-800 mb-4">
            Combo bữa trưa cho {combo.servings} người
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-stone-700">Tổng: {combo.totalCalories} kcal</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-stone-700">~{combo.totalTime} phút</span>
            </div>
          </div>
        </div>

        {/* Dishes */}
        <div className="space-y-4">
          {combo.dishes.map((dish) => (
            <div key={dish.role} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-orange-50 px-4 py-2 border-b border-orange-100">
                <span className="text-sm font-medium text-orange-800">── {dish.label} ──</span>
              </div>
              <div className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={dish.recipe.imageUrl}
                      alt={dish.recipe.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-800 mb-2">
                      {dish.recipe.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-stone-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {dish.recipe.cookTime}p
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {dish.recipe.calories} kcal
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {dish.recipe.cuisine}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-orange-600 hover:text-orange-700">
                    <RefreshCw className="w-4 h-4" />
                    Đổi
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nutrition Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-stone-800 mb-4">Dinh dưỡng tổng combo:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-stone-600">Calories</span>
              </div>
              <p className="text-xl font-semibold text-stone-800">{combo.totalCalories} kcal</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💪</span>
                <span className="text-sm text-stone-600">Protein</span>
              </div>
              <p className="text-xl font-semibold text-stone-800">65g</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🍚</span>
                <span className="text-sm text-stone-600">Carbs</span>
              </div>
              <p className="text-xl font-semibold text-stone-800">95g</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🧈</span>
                <span className="text-sm text-stone-600">Fat</span>
              </div>
              <p className="text-xl font-semibold text-stone-800">35g</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white gap-2">
            <Check className="w-5 h-5" />
            Chọn combo này
          </Button>
          <Button variant="outline" className="w-full h-12 gap-2">
            <RefreshCw className="w-5 h-5" />
            Đổi toàn bộ combo
          </Button>
        </div>
      </div>
    </div>
  );
}
