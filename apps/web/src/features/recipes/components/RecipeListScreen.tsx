'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Heart, Clock, Flame, ChevronRight, BookmarkPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/layout/ImageWithFallback';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api/client';

const cuisineLabels: Record<string, string> = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam', international: 'Quốc tế' };
const difficultyLabels: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };

interface RecipeSummary {
  id: string; name: string; imageUrl: string | null; description: string;
  cuisine: string; difficulty: string; prepTime: number; cookTime: number;
  totalTime: number; defaultServings: number; calories: number | null; mealTypes: string[];
}

interface PaginatedResponse {
  data: RecipeSummary[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

const categories = [
  { value: '', label: 'Tất cả' },
  { value: 'north', label: 'Miền Bắc' },
  { value: 'central', label: 'Miền Trung' },
  { value: 'south', label: 'Miền Nam' },
  { value: 'international', label: 'Quốc tế' },
];

export default function RecipeListScreen() {
  const [activeCuisine, setActiveCuisine] = useState('');
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const params = new URLSearchParams({ pageSize: '20', sortBy });
    if (activeCuisine) params.set('cuisine', activeCuisine);

    apiClient<RecipeSummary[]>(`/recipes?${params}`)
      .then((res) => {
        // apiClient extracts json.data — for paginated endpoints this is the array directly
        const list = Array.isArray(res) ? res : [];
        setRecipes(list);
        setTotal(list.length);
      })
      .catch(() => { });
  }, [activeCuisine, sortBy]);

  const handleBookmark = async (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const isBookmarked = bookmarked.has(recipeId);

    // Optimistic update — fill heart immediately
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (isBookmarked) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });

    try {
      if (isBookmarked) {
        await apiClient(`/recipes/${recipeId}/bookmark`, { method: 'DELETE' });
      } else {
        await apiClient(`/recipes/${recipeId}/bookmark`, { method: 'POST' });
      }
    } catch {
      // Revert on API failure
      setBookmarked((prev) => {
        const next = new Set(prev);
        if (isBookmarked) next.add(recipeId);
        else next.delete(recipeId);
        return next;
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-64 shrink-0 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-orange-500" /> Bộ Lọc
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-stone-800 mb-3">Tìm kiếm</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input placeholder="Tên món ăn, nguyên liệu..." className="pl-9 bg-stone-50 border-stone-200" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-800 mb-3">Vùng miền</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <label key={cat.value} className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveCuisine(cat.value)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeCuisine === cat.value ? 'bg-orange-500 border-orange-500' : 'border-stone-300 group-hover:border-orange-400'}`}>
                      {activeCuisine === cat.value && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <span className={`text-sm ${activeCuisine === cat.value ? 'text-stone-900 font-medium' : 'text-stone-600'}`}>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Tất cả món ăn</h1>
            <p className="text-stone-600">Hiển thị {total} công thức phù hợp</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/recipes/new">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                <BookmarkPlus className="w-4 h-4" /> Thêm món
              </Button>
            </Link>
            <div className="hidden sm:block">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 outline-none cursor-pointer">
                <option value="popularity">Phổ biến nhất</option>
                <option value="createdAt">Mới nhất</option>
                <option value="cookTime">Thời gian nấu ngắn nhất</option>
                <option value="calories">Calories thấp nhất</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {recipes.map((recipe, idx) => (
            <motion.div key={recipe.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link href={`/recipes/${recipe.id}`} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all group-hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback src={recipe.imageUrl || ''} alt={recipe.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <button
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/70 backdrop-blur-md transition-all z-10 hover:scale-110 active:scale-95"
                      onClick={(e) => handleBookmark(e, recipe.id)}
                      title={bookmarked.has(recipe.id) ? 'Bỏ lưu' : 'Lưu công thức'}
                    >
                      <Heart
                        className="w-4 h-4 transition-all duration-200"
                        style={{
                          fill: bookmarked.has(recipe.id) ? '#ef4444' : 'transparent',
                          stroke: bookmarked.has(recipe.id) ? '#ef4444' : '#78716c',
                        }}
                      />
                    </button>
                    <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-stone-800 border-none shadow-sm">{cuisineLabels[recipe.cuisine] || recipe.cuisine}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-stone-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{recipe.name}</h3>
                    <div className="flex items-center justify-between text-sm text-stone-500 mt-4 pt-4 border-t border-stone-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-blue-500" /> {recipe.cookTime}p</span>
                        {recipe.calories && <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" /> {recipe.calories} kcal</span>}
                      </div>
                      <span className="text-orange-600 group-hover:translate-x-1 transition-transform"><ChevronRight className="w-5 h-5" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-16 text-stone-500">
            <div className="text-6xl mb-4">🍳</div>
            <p className="text-lg font-medium">Chưa có công thức nào</p>
            <p className="text-sm mt-2">Hãy đăng nhập để xem các công thức phù hợp với bạn!</p>
          </div>
        )}
      </div>
    </div>
  );
}
