'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, Share2, Clock, Flame, ChefHat, Play, Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageWithFallback } from '@/components/layout/ImageWithFallback';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';

const cuisineLabels: Record<string, string> = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam', international: 'Quốc tế' };
const difficultyLabels: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
const mealTypeLabels: Record<string, string> = { breakfast: 'Sáng', lunch: 'Trưa', dinner: 'Tối', snack: 'Ăn vặt' };
const groupLabels: Record<string, string> = { main: 'Nguyên liệu chính', seasoning: 'Gia vị', garnish: 'Trang trí' };

interface Ingredient { id: string; name: string; quantity: number; originalQuantity: number; unit: string; group: string; isOptional: boolean; }
interface Step { stepNumber: number; description: string; imageUrl: string | null; duration: number | null; }
interface Nutrition { calories: number; protein: number; carbs: number; fat: number; fiber: number | null; sodium: number | null; servings: number; }

interface RecipeDetailData {
  id: string; name: string; imageUrl: string | null; description: string;
  cuisine: string; difficulty: string; prepTime: number; cookTime: number; totalTime: number;
  defaultServings: number; requestedServings: number; mealTypes: string[];
  videoUrl: string | null; tags: string[]; isBookmarked: boolean;
  ingredients: Ingredient[]; steps: Step[]; nutrition: Nutrition | null;
}

export default function RecipeDetailScreen({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeDetailData | null>(null);
  const [servings, setServings] = useState(2);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    apiClient<RecipeDetailData>(`/recipes/${recipeId}?servings=${servings}`)
      .then((r) => {
        setRecipe(r);
        setIsBookmarked(r.isBookmarked);
        setServings(r.requestedServings);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [recipeId, servings]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-stone-500 font-medium">Đang tải công thức...</p>
      </div>
    );
  }

  // Error state
  if (error || !recipe) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Không tìm thấy công thức</h2>
        <p className="text-stone-500 mb-6">Công thức này không tồn tại hoặc đã bị xóa.</p>
        <Button onClick={() => router.push('/recipes')} className="bg-orange-500 hover:bg-orange-600 text-white">Quay lại danh sách</Button>
      </div>
    );
  }

  // Group ingredients by group type
  const groupedIngredients = recipe.ingredients.reduce<Record<string, Ingredient[]>>((acc, ing) => {
    const group = ing.group || 'main';
    if (!acc[group]) acc[group] = [];
    acc[group].push(ing);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
          <ChevronLeft className="w-5 h-5" /><span className="font-medium">Quay lại danh sách</span>
        </button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => toast.success('Đã copy link')} className="gap-2 text-stone-600 border-stone-200"><Share2 className="w-4 h-4" /> Chia sẻ</Button>
          <Button variant="outline" className="gap-2 text-stone-600 border-stone-200 hidden sm:flex"><Printer className="w-4 h-4" /> In công thức</Button>
          <Button 
            variant={isBookmarked ? 'default' : 'outline'} 
            onClick={async () => {
              try {
                const newVal = !isBookmarked;
                setIsBookmarked(newVal); 
                if (newVal) {
                  await apiClient(`/recipes/${recipe.id}/bookmark`, { method: 'POST' });
                  toast.success(`Đã lưu "${recipe.name}"`);
                } else {
                  await apiClient(`/recipes/${recipe.id}/bookmark`, { method: 'DELETE' });
                  toast.success(`Đã bỏ lưu "${recipe.name}"`);
                }
              } catch (e) {
                setIsBookmarked(isBookmarked); // revert optimistic update
                toast.error('Có lỗi xảy ra!');
              }
            }}
            className={`gap-2 ${isBookmarked ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'text-stone-600 border-stone-200'}`}>
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} /> {isBookmarked ? 'Đã lưu' : 'Lưu'}
          </Button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-72 lg:h-full min-h-[400px]">
            <ImageWithFallback src={recipe.imageUrl || ''} alt={recipe.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-orange-50 text-orange-700">{cuisineLabels[recipe.cuisine] || recipe.cuisine}</Badge>
              {recipe.mealTypes.map((t) => <Badge key={t} variant="secondary" className="bg-stone-100 text-stone-700">{mealTypeLabels[t] || t}</Badge>)}
              {recipe.tags.map((t) => <Badge key={t} variant="outline" className="text-stone-500 border-stone-200">{t}</Badge>)}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4">{recipe.name}</h1>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">{recipe.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-stone-100 mb-8">
              <div className="flex flex-col gap-1"><span className="text-stone-500 text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" /> Chuẩn bị</span><span className="font-semibold text-stone-900">{recipe.prepTime} phút</span></div>
              <div className="flex flex-col gap-1"><span className="text-stone-500 text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" /> Nấu</span><span className="font-semibold text-stone-900">{recipe.cookTime} phút</span></div>
              <div className="flex flex-col gap-1"><span className="text-stone-500 text-sm flex items-center gap-1.5"><Flame className="w-4 h-4" /> Calories</span><span className="font-semibold text-stone-900">{recipe.nutrition?.calories || '—'} kcal</span></div>
              <div className="flex flex-col gap-1"><span className="text-stone-500 text-sm flex items-center gap-1.5"><ChefHat className="w-4 h-4" /> Độ khó</span><span className="font-semibold text-stone-900">{difficultyLabels[recipe.difficulty] || recipe.difficulty}</span></div>
            </div>
            <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white gap-2 h-12 px-8 text-lg font-medium rounded-xl">
              <Play className="w-5 h-5 fill-current" /> Bắt đầu nấu
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">Nguyên liệu</h2>
              <div className="flex items-center gap-3 bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-7 h-7 rounded bg-white shadow-sm flex items-center justify-center text-stone-600 hover:text-orange-500 border border-transparent hover:border-orange-200 transition-all">−</button>
                <span className="font-semibold w-6 text-center text-sm">{servings}</span>
                <button onClick={() => setServings(servings + 1)} className="w-7 h-7 rounded bg-white shadow-sm flex items-center justify-center text-stone-600 hover:text-orange-500 border border-transparent hover:border-orange-200 transition-all">+</button>
              </div>
            </div>
            {Object.entries(groupedIngredients).map(([group, items]) => (
              <div key={group} className="mb-6 last:mb-0">
                <h3 className="font-semibold text-stone-800 mb-3">{groupLabels[group] || group}</h3>
                <div className="space-y-1">
                  {items.map((item) => (
                    <label key={item.id} className="flex items-center gap-3 p-2.5 hover:bg-orange-50 rounded-lg cursor-pointer group transition-colors">
                      <Checkbox className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                      <span className="flex-1 text-stone-700 group-hover:text-stone-900 transition-colors">{item.name}{item.isOptional ? ' (tùy chọn)' : ''}</span>
                      <span className="text-stone-500 font-medium">{item.quantity} {item.unit}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {recipe.ingredients.length === 0 && <p className="text-stone-400 text-center py-4">Chưa có thông tin nguyên liệu</p>}
          </div>
        </div>

        {/* Steps + Nutrition */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Cách làm</h2>
            {recipe.steps.length === 0 && <p className="text-stone-400 text-center py-4">Chưa có hướng dẫn</p>}
            <div className="space-y-8">
              {recipe.steps.map((step, index) => (
                <div key={step.stepNumber} className="flex gap-6 relative">
                  {index !== recipe.steps.length - 1 && <div className="absolute left-6 top-14 bottom-[-2rem] w-[2px] bg-stone-100" />}
                  <div className="w-12 h-12 shrink-0 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl border-4 border-white shadow-sm z-10 relative">{step.stepNumber}</div>
                  <div className="flex-1 pb-2">
                    <p className="text-stone-600 leading-relaxed mb-4 text-lg" dangerouslySetInnerHTML={{ __html: step.description.replace(/\*\*(.*?)\*\*/g, '<strong class="text-stone-800">$1</strong>') }} />
                    {step.duration && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg text-blue-700 border border-blue-100">
                        <Clock className="w-4 h-4" /><span className="font-medium">⏱ {step.duration} phút</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          {recipe.nutrition && (
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-stone-100">
              <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> Thông tin dinh dưỡng (1 phần)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="p-4 bg-stone-50 rounded-xl"><div className="text-2xl font-bold text-stone-900 mb-1">{recipe.nutrition.calories}</div><div className="text-sm text-stone-500 font-medium">Calories</div></div>
                <div className="p-4 bg-orange-50 rounded-xl"><div className="text-2xl font-bold text-orange-700 mb-1">{recipe.nutrition.protein}g</div><div className="text-sm text-orange-600 font-medium">Protein</div></div>
                <div className="p-4 bg-blue-50 rounded-xl"><div className="text-2xl font-bold text-blue-700 mb-1">{recipe.nutrition.carbs}g</div><div className="text-sm text-blue-600 font-medium">Carbs</div></div>
                <div className="p-4 bg-yellow-50 rounded-xl"><div className="text-2xl font-bold text-yellow-700 mb-1">{recipe.nutrition.fat}g</div><div className="text-sm text-yellow-600 font-medium">Fat</div></div>
                {recipe.nutrition.fiber !== null && <div className="p-4 bg-green-50 rounded-xl"><div className="text-2xl font-bold text-green-700 mb-1">{recipe.nutrition.fiber}g</div><div className="text-sm text-green-600 font-medium">Fiber</div></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
