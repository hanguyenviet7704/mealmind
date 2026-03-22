'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, ChevronLeft, ChevronRight, MoreVertical, Flame, Clock, Calendar,
  CheckCircle2, X, Search, Shuffle, Sparkles, Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/layout/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api/client';

/* ── Types ───────────────────────────────────────────────── */
interface MealItem { id: string; name: string; imageUrl: string | null; calories: number | null; cookTime: number; cuisine: string; difficulty: string; }
interface DayPlan { day: string; date: string; isToday: boolean; meals: { breakfast: MealItem | null; lunch: MealItem | null; dinner: MealItem | null; }; }

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface RecipeSummary {
  id: string; name: string; imageUrl: string | null; description: string;
  cuisine: string; difficulty: string; cookTime: number; prepTime: number;
  totalTime: number; calories: number | null; mealTypes: string[];
}

const cuisineLabels: Record<string, string> = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam', international: 'Quốc tế' };
const difficultyLabels: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };

/* ── Build initial week plan from current date ───────────── */
function buildWeekPlan(): DayPlan[] {
  const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const now = new Date();
  const mondayOffset = now.getDay() === 0 ? -6 : 1 - now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dayNum = date.getDay();
    return {
      day: dayNames[dayNum],
      date: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
      isToday: date.toDateString() === now.toDateString(),
      meals: { breakfast: null, lunch: null, dinner: null },
    };
  });
}

/* ── Recipe Picker Modal ─────────────────────────────────── */
function RecipePickerModal({
  open, onClose, onSelect, mealLabel,
}: { open: boolean; onClose: () => void; onSelect: (r: RecipeSummary) => void; mealLabel: string; }) {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    apiClient<RecipeSummary[]>('/recipes?pageSize=50&sortBy=popularity')
      .then((res) => { setRecipes(Array.isArray(res) ? res : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = search
    ? recipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    : recipes;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Chọn món cho {mealLabel.toLowerCase()}</h2>
            <p className="text-sm text-stone-500 mt-1">{filtered.length} công thức có sẵn</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X className="w-5 h-5 text-stone-600" /></button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-stone-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên món ăn..."
              className="pl-10 bg-stone-50 border-stone-200"
            />
          </div>
        </div>

        {/* Recipe List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading && <div className="text-center py-10 text-stone-400">Đang tải...</div>}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 text-stone-400">
              <div className="text-4xl mb-2">🍳</div>
              <p>Không tìm thấy công thức nào</p>
            </div>
          )}
          {filtered.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => onSelect(recipe)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all text-left group"
            >
              <ImageWithFallback src={recipe.imageUrl || ''} alt={recipe.name} className="w-16 h-16 rounded-lg object-cover shrink-0 shadow-sm" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-stone-800 truncate group-hover:text-orange-600 transition-colors">{recipe.name}</h4>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500">
                  <Badge variant="secondary" className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5">{cuisineLabels[recipe.cuisine] || recipe.cuisine}</Badge>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.cookTime}p</span>
                  {recipe.calories && <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {recipe.calories} kcal</span>}
                </div>
              </div>
              <div className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Meal Slot Component ─────────────────────────────────── */
function MealSlot({ meal, label, time, color, onAdd, onRemove, onSwap }: {
  meal: MealItem | null; label: string; time: string; color: string;
  onAdd: () => void; onRemove: () => void; onSwap: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:border-orange-200 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-8 ${color} rounded-full`}></div>
          <div><h3 className="text-lg font-bold text-stone-800">{label}</h3><span className="text-sm text-stone-500">{time}</span></div>
        </div>
      </div>
      {meal ? (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-stone-100 bg-stone-50/50 group">
          <ImageWithFallback src={meal.imageUrl || ''} alt={meal.name} className="w-full sm:w-40 h-40 sm:h-32 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow" />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <Link href={`/recipes/${meal.id}`}><h4 className="text-xl font-bold text-stone-800 mb-2 truncate hover:text-orange-600 transition-colors">{meal.name}</h4></Link>
              <button onClick={onRemove} className="p-2 text-stone-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors" title="Xóa"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600 mb-4">
              {meal.calories && <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm"><Flame className="w-4 h-4 text-orange-500" /><span className="font-medium">{meal.calories}</span> kcal</span>}
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm"><Clock className="w-4 h-4 text-blue-500" /><span className="font-medium">{meal.cookTime}</span> phút</span>
            </div>
            <Button variant="outline" size="sm" onClick={onSwap} className="w-fit text-orange-600 border-orange-200 hover:bg-orange-50 gap-1.5">
              <Shuffle className="w-3.5 h-3.5" /> Đổi món khác
            </Button>
          </div>
        </motion.div>
      ) : (
        <button onClick={onAdd} className="w-full h-32 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50/50 transition-all group">
          <div className="w-10 h-10 bg-stone-100 group-hover:bg-orange-100 rounded-full flex items-center justify-center mb-2 transition-colors"><Plus className="w-5 h-5" /></div>
          <span className="font-medium">Thêm món ăn cho {label.toLowerCase()}</span>
        </button>
      )}
    </div>
  );
}

/* ── Main Screen ─────────────────────────────────────────── */
export default function MealPlanScreen() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [plan, setPlan] = useState<DayPlan[]>(buildWeekPlan);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMeal, setPickerMeal] = useState<{ dayIdx: number; mealType: MealType; label: string } | null>(null);

  // Set today as selected
  useEffect(() => {
    const todayIdx = plan.findIndex((d) => d.isToday);
    if (todayIdx >= 0) setSelectedDay(todayIdx);
  }, []);

  const openPicker = (mealType: MealType, label: string) => {
    setPickerMeal({ dayIdx: selectedDay, mealType, label });
    setPickerOpen(true);
  };

  const addRecipe = (recipe: RecipeSummary) => {
    if (!pickerMeal) return;
    const { dayIdx, mealType } = pickerMeal;
    const newPlan = [...plan];
    newPlan[dayIdx] = {
      ...newPlan[dayIdx],
      meals: {
        ...newPlan[dayIdx].meals,
        [mealType]: {
          id: recipe.id,
          name: recipe.name,
          imageUrl: recipe.imageUrl,
          calories: recipe.calories,
          cookTime: recipe.cookTime,
          cuisine: recipe.cuisine,
          difficulty: recipe.difficulty,
        } as MealItem,
      },
    };
    setPlan(newPlan);
    setPickerOpen(false);
  };

  const removeRecipe = (mealType: MealType) => {
    const newPlan = [...plan];
    newPlan[selectedDay] = {
      ...newPlan[selectedDay],
      meals: { ...newPlan[selectedDay].meals, [mealType]: null },
    };
    setPlan(newPlan);
  };

  const autoFill = async () => {
    try {
      const res = await apiClient<RecipeSummary[]>('/recipes/random?count=3');
      const list = Array.isArray(res) ? res : [];
      if (list.length >= 3) {
        const newPlan = [...plan];
        newPlan[selectedDay] = {
          ...newPlan[selectedDay],
          meals: {
            breakfast: { id: list[0].id, name: list[0].name, imageUrl: list[0].imageUrl, calories: list[0].calories, cookTime: list[0].cookTime, cuisine: list[0].cuisine, difficulty: list[0].difficulty },
            lunch: { id: list[1].id, name: list[1].name, imageUrl: list[1].imageUrl, calories: list[1].calories, cookTime: list[1].cookTime, cuisine: list[1].cuisine, difficulty: list[1].difficulty },
            dinner: { id: list[2].id, name: list[2].name, imageUrl: list[2].imageUrl, calories: list[2].calories, cookTime: list[2].cookTime, cuisine: list[2].cuisine, difficulty: list[2].difficulty },
          },
        };
        setPlan(newPlan);
      }
    } catch { /* ignore */ }
  };

  const clearDay = () => {
    const newPlan = [...plan];
    newPlan[selectedDay] = { ...newPlan[selectedDay], meals: { breakfast: null, lunch: null, dinner: null } };
    setPlan(newPlan);
  };

  const currentDay = plan[selectedDay];
  const dayCalories = (['breakfast', 'lunch', 'dinner'] as MealType[])
    .reduce((sum, mt) => sum + (currentDay.meals[mt]?.calories || 0), 0);

  return (
    <>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-stone-900">Tuần này</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-stone-50 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button className="p-2 bg-stone-50 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="space-y-2">
              {plan.map((day, idx) => {
                const isSelected = selectedDay === idx;
                const filledCount = [day.meals.breakfast, day.meals.lunch, day.meals.dinner].filter(Boolean).length;
                return (
                  <button key={idx} onClick={() => setSelectedDay(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isSelected ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'hover:bg-orange-50 text-stone-700'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isSelected ? 'bg-white/20' : day.isToday ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-900'}`}>
                        {day.date.split('/')[0]}
                      </div>
                      <div className="text-left">
                        <div className={`font-semibold ${isSelected ? 'text-white' : 'text-stone-900'}`}>{day.day}</div>
                        <div className={`text-xs ${isSelected ? 'text-orange-100' : 'text-stone-500'}`}>
                          {filledCount > 0 ? `${filledCount}/3 bữa` : 'Chưa có thực đơn'}
                        </div>
                      </div>
                    </div>
                    {filledCount === 3 && <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-green-500'}`} />}
                    {filledCount > 0 && filledCount < 3 && <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-white' : 'border-orange-400'} flex items-center justify-center`}><div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-orange-400'}`} /></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nutrition Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
            <h3 className="font-bold text-orange-900 mb-3">Dinh dưỡng hôm nay</h3>
            {dayCalories > 0 ? (
              <>
                <div className="text-3xl font-bold text-orange-600 mb-1">{dayCalories} <span className="text-base font-normal text-orange-500">kcal</span></div>
                <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden mt-3"><div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${Math.min(100, (dayCalories / 2000) * 100)}%` }}></div></div>
                <p className="text-xs text-orange-600 mt-2">{Math.round((dayCalories / 2000) * 100)}% mục tiêu 2000 kcal</p>
              </>
            ) : (
              <p className="text-sm text-orange-700">Thêm món ăn để xem thông tin dinh dưỡng</p>
            )}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">Thực đơn {currentDay.day.toLowerCase()} <Calendar className="w-5 h-5 text-stone-400" /></h1>
              <p className="text-stone-600 mt-1">Ngày {currentDay.date}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={clearDay} className="text-stone-700 border-stone-200 hover:bg-stone-50 gap-1.5"><Trash2 className="w-4 h-4" /> Xóa tất cả</Button>
              <Button onClick={autoFill} className="bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-sm"><Sparkles className="w-4 h-4" /> Tạo tự động</Button>
            </div>
          </div>

          <div className="space-y-6">
            <MealSlot meal={currentDay.meals.breakfast} label="Bữa sáng" time="6:00 - 9:00" color="bg-blue-400"
              onAdd={() => openPicker('breakfast', 'Bữa sáng')} onRemove={() => removeRecipe('breakfast')} onSwap={() => openPicker('breakfast', 'Bữa sáng')} />
            <MealSlot meal={currentDay.meals.lunch} label="Bữa trưa" time="11:00 - 13:00" color="bg-orange-400"
              onAdd={() => openPicker('lunch', 'Bữa trưa')} onRemove={() => removeRecipe('lunch')} onSwap={() => openPicker('lunch', 'Bữa trưa')} />
            <MealSlot meal={currentDay.meals.dinner} label="Bữa tối" time="18:00 - 20:00" color="bg-indigo-400"
              onAdd={() => openPicker('dinner', 'Bữa tối')} onRemove={() => removeRecipe('dinner')} onSwap={() => openPicker('dinner', 'Bữa tối')} />
          </div>
        </div>
      </div>

      {/* Recipe Picker Modal */}
      <AnimatePresence>
        {pickerOpen && pickerMeal && (
          <RecipePickerModal
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            onSelect={addRecipe}
            mealLabel={pickerMeal.label}
          />
        )}
      </AnimatePresence>
    </>
  );
}
