'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Flame, Zap, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/layout/ImageWithFallback';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api/client';

/* ── Enum → Display mappings ─────────────────────────────── */
const cuisineLabels: Record<string, string> = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam', international: 'Quốc tế' };
const difficultyLabels: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };

/* ── Types matching API response ─────────────────────────── */
interface RecipeSummary {
  id: string;
  name: string;
  imageUrl: string | null;
  description: string;
  cuisine: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  defaultServings: number;
  calories: number | null;
  mealTypes: string[];
}

export default function HomeScreen() {
  const [mealType, setMealType] = useState('lunch');
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setMealType('breakfast');
    else if (hour >= 10 && hour < 14) setMealType('lunch');
    else if (hour >= 14 && hour < 17) setMealType('snack');
    else if (hour >= 17 && hour < 22) setMealType('dinner');
    else setMealType('snack');
  }, []);

  useEffect(() => {
    setLoading(true);
    apiClient<RecipeSummary[]>(`/recipes?mealType=${mealType}&pageSize=6&sortBy=popularity`)
      .then((res) => {
        const list = Array.isArray(res) ? res : [];
        setRecipes(list);
      })
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, [mealType]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Chào buổi {mealType === 'breakfast' ? 'sáng' : mealType === 'lunch' ? 'trưa' : mealType === 'dinner' ? 'tối' : 'phụ'}! 👋
          </h1>
          <p className="text-stone-600">Hôm nay bạn muốn nấu món gì? Khám phá ngay các gợi ý tốt nhất nhé.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-orange-50 rounded-lg p-4 border border-orange-100 flex items-center gap-4 shadow-sm">
          <div className="bg-orange-100 p-2 rounded-full"><Zap className="w-6 h-6 text-orange-600" /></div>
          <div>
            <p className="text-sm text-stone-600 font-medium">Gợi ý hôm nay</p>
            <p className="text-lg font-bold text-orange-700">{recipes.length} <span className="text-sm font-normal text-stone-500">món phù hợp</span></p>
          </div>
          <Link href="/upgrade"><Button size="sm" variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-100">Nâng cấp Pro</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tools */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Công cụ nhanh</h2>
          {[
            { href: '/combo', emoji: '🍱', title: 'Combo Gia Đình', desc: 'Gợi ý mâm cơm 3 món' },
            { href: '/recipes/random', emoji: '🎲', title: 'Món Ngẫu Nhiên', desc: 'Khám phá món mới lạ' },
            { href: '/quick-cook', emoji: '⚡', title: 'Nấu Nhanh 15 Phút', desc: 'Giải pháp cho ngày bận' },
          ].map((tool) => (
            <Link key={tool.title} href={tool.href} className="block w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-stone-100 text-center group hover:border-orange-200">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{tool.emoji}</div>
              <div className="font-semibold text-stone-800 mb-1">{tool.title}</div>
              <div className="text-sm text-stone-500">{tool.desc}</div>
            </Link>
          ))}
        </div>

        {/* Main Grid */}
        <div className="lg:col-span-3">
          {/* Meal Type Tabs */}
          <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${mealType === type
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                  }`}
              >
                {type === 'breakfast' && 'Bữa Sáng'}
                {type === 'lunch' && 'Bữa Trưa'}
                {type === 'dinner' && 'Bữa Tối'}
                {type === 'snack' && 'Ăn Vặt'}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <span className="ml-3 text-stone-500 font-medium">Đang tải gợi ý...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && recipes.length === 0 && (
            <div className="text-center py-16 text-stone-500">
              <div className="text-6xl mb-4">🍳</div>
              <p className="text-lg font-medium">Chưa có món nào cho bữa này</p>
              <p className="text-sm mt-2">Hãy thử chuyển sang bữa khác hoặc <Link href="/recipes" className="text-orange-600 font-semibold hover:underline">xem tất cả công thức</Link></p>
            </div>
          )}

          {/* Recipe Cards */}
          {!loading && recipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback src={recipe.imageUrl || ''} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-stone-600 hover:text-orange-500 hover:bg-white transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">{cuisineLabels[recipe.cuisine] || recipe.cuisine}</Badge>
                      <Badge variant="outline" className="text-stone-500 border-stone-200">{difficultyLabels[recipe.difficulty] || recipe.difficulty}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">{recipe.name}</h3>
                    <p className="text-sm text-stone-600 mb-4 line-clamp-2">{recipe.description}</p>
                    <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-stone-500">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> {recipe.cookTime}p</span>
                        {recipe.calories && <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500" /> {recipe.calories} kcal</span>}
                      </div>
                      <Link href={`/recipes/${recipe.id}`} className="text-orange-600 font-semibold text-sm flex items-center hover:text-orange-700">
                        Chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
