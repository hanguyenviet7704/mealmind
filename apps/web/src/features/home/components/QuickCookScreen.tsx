'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, Clock, Flame, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/layout/ImageWithFallback';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api/client';

const cuisineLabels: Record<string, string> = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam', international: 'Quốc tế' };

interface RecipeSummary {
  id: string; name: string; imageUrl: string | null; description: string;
  cuisine: string; difficulty: string; cookTime: number; calories: number | null;
  mealTypes: string[];
}

const filterOptions = [
  { id: 'all', label: 'Tất cả' },
  { id: 'breakfast', label: 'Sáng' },
  { id: 'lunch', label: 'Trưa' },
  { id: 'dinner', label: 'Tối' },
];

export default function QuickCookScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient<RecipeSummary[]>('/recipes?pageSize=50&sortBy=cookTime')
      .then((res) => {
        const list = Array.isArray(res) ? res : [];
        // Filter for recipes ≤ 15 minutes cook time
        setRecipes(list.filter((r) => r.cookTime <= 15));
      })
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredRecipes = selectedFilter === 'all'
    ? recipes
    : recipes.filter((r) => r.mealTypes?.includes(selectedFilter));

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-6">
        <ArrowLeft className="w-5 h-5" /><span className="font-medium">Quay lại</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4 shadow-lg">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Nấu nhanh ⚡</h1>
        <div className="flex items-center justify-center gap-2 text-stone-500 mb-1">
          <Clock className="w-5 h-5" />
          <p className="text-lg">Chỉ dưới 15 phút</p>
        </div>
        <p className="text-stone-400">Hoàn hảo cho những ngày bận rộn</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${selectedFilter === filter.id
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                : 'bg-white border-stone-200 text-stone-600 hover:border-orange-300 hover:bg-orange-50'
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-3 text-stone-500 font-medium">Đang tải...</span>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredRecipes.length === 0 && (
        <div className="text-center py-16 text-stone-500">
          <div className="text-6xl mb-4">🍳</div>
          <p className="text-lg font-medium">Không tìm thấy món nấu nhanh</p>
          <p className="text-sm mt-2">Hãy thử chọn filter khác hoặc <Link href="/recipes" className="text-orange-600 font-semibold hover:underline">xem tất cả công thức</Link></p>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && filteredRecipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredRecipes.map((recipe, idx) => (
            <motion.div key={recipe.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-stone-100 group">
              <div className="relative h-48">
                <ImageWithFallback src={recipe.imageUrl || ''} alt={recipe.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-600 hover:text-orange-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3">
                  <div className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                    <Clock className="w-3 h-3" /> {recipe.cookTime} phút
                  </div>
                </div>
              </div>
              <div className="p-5">
                <Link href={`/recipes/${recipe.id}`}>
                  <h3 className="font-bold text-stone-800 mb-2 line-clamp-1 hover:text-orange-600 transition-colors text-lg">{recipe.name}</h3>
                </Link>
                <div className="flex items-center gap-3 mb-3 text-sm text-stone-600">
                  {recipe.calories && <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" /> {recipe.calories} kcal</span>}
                  <Badge variant="secondary" className="text-xs">{cuisineLabels[recipe.cuisine] || recipe.cuisine}</Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* All recipes link */}
      {!loading && (
        <div className="text-center pt-8">
          <Link href="/recipes">
            <Button variant="outline" className="px-8 border-stone-200 text-stone-700 hover:bg-stone-50">Xem tất cả công thức →</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
