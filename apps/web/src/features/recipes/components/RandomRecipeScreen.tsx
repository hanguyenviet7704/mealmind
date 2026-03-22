'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shuffle, Clock, Flame, ChefHat, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/layout/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api/client';

const cuisineLabels: Record<string, string> = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam', international: 'Quốc tế' };
const difficultyLabels: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };

interface RecipeSummary {
  id: string; name: string; imageUrl: string | null; description: string;
  cuisine: string; difficulty: string; cookTime: number; prepTime: number;
  totalTime: number; calories: number | null; mealTypes: string[];
}

export default function RandomRecipeScreen() {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeSummary | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [key, setKey] = useState(0);

  const fetchRandom = useCallback(async () => {
    setIsSpinning(true);
    try {
      const res = await apiClient<RecipeSummary[]>('/recipes/random?count=1');
      const list = Array.isArray(res) ? res : [];
      if (list.length > 0) {
        // Small delay for animation effect
        await new Promise((r) => setTimeout(r, 600));
        setRecipe(list[0]);
        setKey((k) => k + 1);
      }
    } catch {
      // Fallback: fetch all and pick random
      try {
        const all = await apiClient<RecipeSummary[]>('/recipes?pageSize=50');
        const list = Array.isArray(all) ? all : [];
        if (list.length > 0) {
          const random = list[Math.floor(Math.random() * list.length)];
          setRecipe(random);
          setKey((k) => k + 1);
        }
      } catch { /* ignore */ }
    } finally {
      setIsSpinning(false);
    }
  }, []);

  useEffect(() => { fetchRandom(); }, [fetchRandom]);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8">
        <ArrowLeft className="w-5 h-5" /><span className="font-medium">Quay lại</span>
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 mb-4 shadow-lg"
        >
          <span className="text-4xl">🎲</span>
        </motion.div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Món Ngẫu Nhiên</h1>
        <p className="text-stone-500 text-lg">Không biết ăn gì? Để MealMind chọn giúp bạn!</p>
      </div>

      {/* Recipe Card */}
      <AnimatePresence mode="wait">
        {recipe && (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white rounded-3xl shadow-lg border border-stone-100 overflow-hidden mb-8"
          >
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <ImageWithFallback src={recipe.imageUrl || ''} alt={recipe.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex gap-2 mb-3">
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-none">{cuisineLabels[recipe.cuisine] || recipe.cuisine}</Badge>
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-none">{difficultyLabels[recipe.difficulty] || recipe.difficulty}</Badge>
                </div>
                <h2 className="text-3xl font-bold mb-2">{recipe.name}</h2>
                <p className="text-white/80 line-clamp-2">{recipe.description}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-stone-50 rounded-xl">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <span className="text-xl font-bold text-stone-800">{recipe.cookTime}p</span>
                  <p className="text-xs text-stone-500 mt-1">Thời gian nấu</p>
                </div>
                <div className="text-center p-4 bg-stone-50 rounded-xl">
                  <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <span className="text-xl font-bold text-stone-800">{recipe.calories || '—'}</span>
                  <p className="text-xs text-stone-500 mt-1">kcal/phần</p>
                </div>
                <div className="text-center p-4 bg-stone-50 rounded-xl">
                  <ChefHat className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <span className="text-xl font-bold text-stone-800">{difficultyLabels[recipe.difficulty] || recipe.difficulty}</span>
                  <p className="text-xs text-stone-500 mt-1">Độ khó</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href={`/recipes/${recipe.id}`} className="flex-1">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg font-medium rounded-xl gap-2">
                    Xem công thức <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shuffle Button */}
      <div className="text-center">
        <Button
          onClick={fetchRandom}
          disabled={isSpinning}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white h-14 px-10 text-lg font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all gap-3 disabled:opacity-50"
        >
          <Shuffle className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
          {isSpinning ? 'Đang chọn...' : 'Chọn món khác'}
        </Button>
      </div>
    </div>
  );
}
