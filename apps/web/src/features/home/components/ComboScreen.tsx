'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Check, Clock, Flame, Loader2, Shuffle, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/layout/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api/client';

const cuisineLabels: Record<string, string> = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam', international: 'Quốc tế' };
const roleLabels: Record<string, string> = { main: 'Món chính', soup: 'Canh', vegetable: 'Rau', dessert: 'Tráng miệng' };
const roleEmoji: Record<string, string> = { main: '🍖', soup: '🍲', vegetable: '🥬', dessert: '🍮' };

interface RecipeSummary {
  id: string; name: string; imageUrl: string | null; description: string;
  cuisine: string; difficulty: string; cookTime: number; calories: number | null;
}

interface ComboDish {
  role: string;
  recipe: RecipeSummary;
}

interface AiComboResponse {
  combo: RecipeSummary[];
  reason: string;
}

export default function ComboScreen() {
  const router = useRouter();
  const [combo, setCombo] = useState<ComboDish[]>([]);
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [servings, setServings] = useState(2);

  const fetchCombo = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await apiClient<AiComboResponse>(`/recipes/combo?servings=${servings}`);
      const list = Array.isArray(res?.combo) ? res.combo : [];
      setReason(res?.reason || '');
      
      const roles = ['main', 'soup', 'vegetable', 'dessert'];
      setCombo(list.map((r, i) => ({ role: roles[i] || 'main', recipe: r })));
    } catch (e) {
      console.error(e);
    } finally { 
      setLoading(false); 
      setRefreshing(false); 
    }
  }, [servings]);

  const swapDish = async (index: number) => {
    try {
      const res = await apiClient<RecipeSummary[]>('/recipes/random?count=1');
      const list = Array.isArray(res) ? res : [];
      if (list.length > 0) {
        const newCombo = [...combo];
        newCombo[index] = { ...newCombo[index], recipe: list[0] };
        setCombo(newCombo);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchCombo(); }, [fetchCombo]);

  const totalCalories = combo.reduce((s, d) => s + (d.recipe.calories || 0), 0);
  const totalTime = combo.reduce((s, d) => s + d.recipe.cookTime, 0);

  const mealType = (() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'sáng';
    if (hour >= 10 && hour < 14) return 'trưa';
    return 'tối';
  })();

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-6">
        <ArrowLeft className="w-5 h-5" /><span className="font-medium">Quay lại</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mb-4 shadow-lg">
          <span className="text-3xl">🍱</span>
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Combo mâm cơm thông minh</h1>
        <p className="text-stone-500">Mâm cơm hoàn chỉnh cho gia đình, gợi ý bởi AI MealMind</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
          <span className="text-stone-600 font-medium text-lg">AI đang suy nghĩ mâm cơm hoàn hảo cho bạn...</span>
          <span className="text-stone-400 text-sm mt-2">Dựa trên thời tiết, mùa và dinh dưỡng</span>
        </div>
      )}

      {/* Summary */}
      {!loading && combo.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-stone-800 text-lg">Combo cho {servings} người</h2>
              <div className="flex items-center gap-6 mt-2 text-stone-600">
                <span className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500" /> Tổng: <strong className="text-stone-800">{totalCalories} kcal</strong></span>
                <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-500" /> ~<strong className="text-stone-800">{totalTime} phút</strong></span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-stone-50 p-1.5 rounded-lg border border-stone-200">
              <Users className="w-4 h-4 text-stone-500 ml-2" />
              <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-7 h-7 rounded bg-white shadow-sm flex items-center justify-center text-stone-600 hover:text-orange-500 border border-transparent hover:border-orange-200">−</button>
              <span className="font-semibold w-6 text-center">{servings}</span>
              <button onClick={() => setServings(servings + 1)} className="w-7 h-7 rounded bg-white shadow-sm flex items-center justify-center text-stone-600 hover:text-orange-500 border border-transparent hover:border-orange-200">+</button>
            </div>
          </div>

          {/* AI Reason string provided by Gemini JSON */}
          {reason && (
             <div className="mt-5 p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex gap-3 items-start">
               <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
               <p className="text-sm text-stone-700 italic">{reason}</p>
             </div>
          )}
        </motion.div>
      )}

      {/* Dishes */}
      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mb-8">
            {combo.map((dish, idx) => (
              <motion.div key={`${dish.role}-${dish.recipe?.id || idx}`}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:border-orange-200 transition-colors">
                <div className="bg-orange-50 px-5 py-2.5 border-b border-orange-100 flex items-center gap-2">
                  <span className="text-lg">{roleEmoji[dish.role] || '🍽️'}</span>
                  <span className="text-sm font-semibold text-orange-800">{roleLabels[dish.role] || dish.role}</span>
                </div>
                
                {dish.recipe ? (
                  <div className="p-5 flex flex-col sm:flex-row gap-5">
                    <ImageWithFallback src={dish.recipe.imageUrl || ''} alt={dish.recipe.name}
                      className="w-full sm:w-28 h-28 rounded-xl object-cover shrink-0 shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <Link href={`/recipes/${dish.recipe.id}`}>
                        <h3 className="font-bold text-stone-800 text-lg mb-2 hover:text-orange-600 transition-colors">{dish.recipe.name}</h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600 mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {dish.recipe.cookTime}p</span>
                        {dish.recipe.calories && <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> {dish.recipe.calories} kcal</span>}
                        <Badge variant="secondary" className="text-xs">{cuisineLabels[dish.recipe.cuisine] || dish.recipe.cuisine}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => swapDish(idx)}
                      className="gap-1.5 text-stone-500 hover:text-orange-600 hover:bg-orange-50 shrink-0 self-start">
                      <RefreshCw className="w-4 h-4" /> Đổi
                    </Button>
                  </div>
                ) : (
                  <div className="p-5 text-stone-400 italic">Không có dữ liệu món ăn</div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      {!loading && combo.length > 0 && (
        <div className="space-y-3">
          <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white gap-2 text-lg font-medium rounded-xl shadow-sm">
            <Check className="w-5 h-5" /> Chọn mâm cơm này
          </Button>
          <Button variant="outline" onClick={fetchCombo} disabled={refreshing}
            className="w-full h-12 gap-2 text-stone-700 border-stone-200 rounded-xl">
            <Shuffle className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} /> {refreshing ? 'AI đang tạo lại...' : 'Đổi mâm cơm khác (AI)'}
          </Button>
        </div>
      )}
    </div>
  );
}
