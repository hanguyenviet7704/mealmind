'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, Loader2, Heart, Clock, Flame, ChevronRight, BookmarkPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/layout/ImageWithFallback';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getBookmarksApi, unbookmarkRecipeApi } from '@/features/recipes/api/bookmarkApi';

const cuisineLabels: Record<string, string> = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam', international: 'Quốc tế' };

interface RecipeSummary {
  id: string; name: string; imageUrl: string | null; description: string;
  cuisine: string; difficulty: string; prepTime: number; cookTime: number;
  totalTime: number; defaultServings: number; calories: number | null; mealTypes: string[];
}

export default function SavedRecipesScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('Tất cả');

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setIsLoading(true);
    try {
      const res = await getBookmarksApi(1, 50);
      // res is { data: RecipeSummary[], meta: {...} } because apiClient unwraps outer { data, meta, error }
      // and the backend returns paginate() which has its own .data array
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res as any) ? (res as any) : [];
      setRecipes(list);
    } catch (error) {
      console.error('Failed to load bookmarks', error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbookmark = async (e: React.MouseEvent, recipeId: string, recipeName: string) => {
    e.preventDefault();
    try {
      await unbookmarkRecipeApi(recipeId);
      toast.success(`Đã bỏ lưu "${recipeName}"`);
      // Update local state by removing it
      setRecipes(recipes.filter(r => r.id !== recipeId));
    } catch {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const activeCategories = ['Tất cả', 'Bữa Sáng', 'Bữa Trưa', 'Bữa Tối'];

  // Filter recipes mentally if needed (assuming backend hasn't filtered mealType)
  const filteredRecipes = activeCat === 'Tất cả' 
    ? recipes 
    : recipes.filter(r => r.mealTypes?.includes(activeCat === 'Bữa Sáng' ? 'breakfast' : activeCat === 'Bữa Trưa' ? 'lunch' : activeCat === 'Bữa Tối' ? 'dinner' : ''));

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pb-24 lg:pb-6 relative min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 bg-white sticky top-0 md:static z-10 py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-stone-700" />
          </button>
          <h1 className="text-xl font-bold text-stone-900">Món ăn đã lưu</h1>
        </div>
        <Link href="/recipes/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2" size="sm">
            <BookmarkPlus className="w-4 h-4" /> Thêm món
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Input 
            placeholder="Tìm kiếm món ăn đã lưu..." 
            className="pl-10 h-12 bg-white border-stone-200 rounded-xl max-w-md"
            disabled={isLoading}
          />
          <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-stone-400" />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {activeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeCat === cat
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white border text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🔖
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">Chưa có món ăn nào</h3>
          <p className="text-stone-500 max-w-sm mx-auto mb-6">
            Lưu lại các món ăn bạn yêu thích để dễ dàng nấu lại vào lần sau.
          </p>
          <Link href="/recipes">
            <button className="text-orange-600 font-medium hover:underline bg-orange-50 px-6 py-2 rounded-lg">
              Khám phá món ăn ngay
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe, idx) => (
            <motion.div key={recipe.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link href={`/recipes/${recipe.id}`} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all group-hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback src={recipe.imageUrl || ''} alt={recipe.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <button 
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-red-500 hover:text-stone-600 border hover:bg-white transition-colors z-10" 
                      onClick={(e) => handleUnbookmark(e, recipe.id, recipe.name)}
                      title="Bỏ lưu"
                    >
                      <Heart className="w-4 h-4 fill-red-500 group-hover:block" />
                    </button>
                    <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-stone-800 border-none shadow-sm">{cuisineLabels[recipe.cuisine] || recipe.cuisine}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-stone-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {recipe.name}
                    </h3>
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
      )}
    </div>
  );
}
