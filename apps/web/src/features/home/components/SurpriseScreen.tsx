'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, Dice5, UtensilsCrossed, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/layout/ImageWithFallback';
import { motion } from 'framer-motion';

const mockRecipes = [
  {
    id: 1,
    name: 'Phở Bò',
    imageUrl: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?w=600',
    cookTime: 45,
    calories: 520,
    cuisine: 'Miền Bắc',
    reason: 'Món này rất hợp với khẩu vị miền Bắc của bạn!',
  },
  {
    id: 2,
    name: 'Cơm tấm sườn nướng',
    imageUrl: 'https://images.unsplash.com/photo-1707535347953-6cf5a129d55c?w=600',
    cookTime: 30,
    calories: 550,
    cuisine: 'Miền Nam',
    reason: 'Nhanh gọn và đủ chất cho bữa trưa!',
  },
  {
    id: 3,
    name: 'Bánh mì thịt nướng',
    imageUrl: 'https://images.unsplash.com/photo-1715925717150-2a6d181d8846?w=600',
    cookTime: 20,
    calories: 420,
    cuisine: 'Miền Nam',
    reason: 'Tiện lợi, dễ làm cho người bận rộn!',
  },
];

export default function SurpriseScreen() {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(true);
  const [currentRecipe, setCurrentRecipe] = useState(mockRecipes[0]);

  useEffect(() => {
    const timer = setTimeout(() => setIsSpinning(false), 1500);
    return () => clearTimeout(timer);
  }, [currentRecipe]);

  const handleSurprise = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockRecipes.length);
      setCurrentRecipe(mockRecipes[randomIndex]);
      setIsSpinning(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-6">
      <div className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 text-stone-600 hover:text-stone-800">
            <ChevronLeft className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <h1 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
            Surprise Me! <Dice5 className="w-5 h-5 text-orange-500" />
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="min-h-[70vh] flex items-center justify-center">
          {isSpinning ? (
            <motion.div
              animate={{ rotate: [0, 360, 720, 1080] }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="text-center"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Dice5 className="w-16 h-16 text-white" />
              </div>
              <p className="text-lg text-stone-600">Đang tìm món ngon...</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative h-80">
                  <ImageWithFallback
                    src={currentRecipe.imageUrl}
                    alt={currentRecipe.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-stone-800 mb-4">{currentRecipe.name}</h2>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-stone-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{currentRecipe.cookTime} phút</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-600">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm">{currentRecipe.calories} kcal</span>
                    </div>
                  </div>

                  <Badge variant="secondary" className="mb-4">⭐ {currentRecipe.cuisine}</Badge>

                  <div className="bg-orange-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-orange-800"><strong>Lý do gợi ý:</strong></p>
                    <p className="text-sm text-stone-700 mt-1">"{currentRecipe.reason}"</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      onClick={() => router.push(`/recipes/${currentRecipe.id}/cook`)}
                      className="bg-orange-500 hover:bg-orange-600 text-white h-14 flex flex-col items-center justify-center gap-1"
                    >
                      <UtensilsCrossed className="w-5 h-5" />
                      <span className="text-xs">Nấu ngay</span>
                    </Button>
                    <Button variant="outline" className="h-14 flex flex-col items-center justify-center gap-1">
                      <Heart className="w-5 h-5" />
                      <span className="text-xs">Lưu</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSurprise}
                      className="h-14 flex flex-col items-center justify-center gap-1 text-orange-600 hover:text-orange-700"
                    >
                      <Dice5 className="w-5 h-5" />
                      <span className="text-xs">Khác</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
