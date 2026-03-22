'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BarChart3, Flame, Calendar, TrendingUp, UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Note: In production, these would come from an API endpoint like /cooking-history
// For MVP, showing the UI structure with placeholder data
// This can be connected when the cooking history API is implemented

export default function CookingHistoryScreen() {
  const router = useRouter();
  const [showStats, setShowStats] = useState(false);

  if (showStats) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setShowStats(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-stone-900">Thống kê nấu ăn</h1>
        </div>

        {/* Cuisine Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <h3 className="font-bold text-stone-800 mb-4">Vùng miền hay nấu</h3>
          <div className="space-y-4">
            {[
              { name: 'Miền Bắc', pct: 45, color: 'bg-orange-500' },
              { name: 'Miền Nam', pct: 35, color: 'bg-orange-400' },
              { name: 'Miền Trung', pct: 15, color: 'bg-orange-300' },
              { name: 'Quốc tế', pct: 5, color: 'bg-orange-200' },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-stone-600">{item.name}</span>
                  <span className="text-sm font-semibold text-stone-800">{item.pct}%</span>
                </div>
                <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Average */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <h3 className="font-bold text-stone-800 mb-4">Dinh dưỡng trung bình / ngày</h3>
          <div className="space-y-3">
            {[
              { label: 'Calo', value: '1,850 / 2,000 kcal', pct: 92 },
              { label: 'Protein', value: '95 / 120g', pct: 79 },
              { label: 'Carbs', value: '230 / 250g', pct: 92 },
              { label: 'Fat', value: '55 / 65g', pct: 85 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-stone-600">{item.label}</span>
                  <span className="font-semibold text-stone-800 text-sm">{item.value}</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recipes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <h3 className="font-bold text-stone-800 mb-4">Top 5 món nấu nhiều nhất</h3>
          <div className="space-y-3">
            {[
              { name: 'Phở bò', count: 12 },
              { name: 'Cơm tấm', count: 9 },
              { name: 'Bún chả', count: 7 },
              { name: 'Canh chua', count: 6 },
              { name: 'Cá kho', count: 5 },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                <span className="text-stone-700 font-medium"><span className="text-orange-500 font-bold mr-2">#{idx + 1}</span>{item.name}</span>
                <Badge variant="secondary" className="bg-orange-50 text-orange-700">{item.count} lần</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Cooking Streak */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
          <h3 className="font-bold text-stone-800 mb-4">Cooking Streak 🔥</h3>
          <div className="text-center">
            <div className="text-4xl mb-2">🔥🔥🔥🔥🔥🔥🔥</div>
            <div className="text-3xl font-bold text-orange-500 mb-1">7 ngày liên tiếp</div>
            <div className="text-sm text-stone-600">Kỷ lục: 14 ngày</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-stone-900">Lịch sử nấu ăn</h1>
        </div>
        <button onClick={() => setShowStats(true)} className="p-2.5 hover:bg-orange-50 rounded-full transition-colors" title="Xem thống kê">
          <BarChart3 className="w-5 h-5 text-orange-500" />
        </button>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: UtensilsCrossed, value: '87', label: 'Món đã nấu' },
            { icon: Calendar, value: '45', label: 'Ngày nấu' },
            { icon: null, value: '⭐ 4.2', label: 'Đánh giá TB' },
            { icon: TrendingUp, value: '7', label: 'Streak' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {stat.icon && <stat.icon className="w-4 h-4 text-orange-600" />}
                <span className="text-2xl font-bold text-orange-600">{stat.value}</span>
              </div>
              <div className="text-xs text-stone-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['Tất cả', 'Tuần này', 'Tháng này', 'Yêu thích'].map((tab, idx) => (
          <button
            key={tab}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
              idx === 0
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="space-y-6">
        {[
          {
            date: 'Hôm nay, 21/03',
            meals: [
              { time: 'Sáng', emoji: '🌅', name: 'Phở bò Hà Nội', rating: 5, calories: 520 },
              { time: 'Trưa', emoji: '☀️', name: 'Cơm tấm sườn', rating: 4, calories: 650 },
            ],
          },
          {
            date: 'Hôm qua, 20/03',
            meals: [
              { time: 'Sáng', emoji: '🌅', name: 'Bánh mì trứng', rating: 3, calories: 380 },
              { time: 'Trưa', emoji: '☀️', name: 'Bún chả Hà Nội', rating: 5, calories: 480 },
              { time: 'Tối', emoji: '🌙', name: 'Canh chua cá', rating: 4, calories: 350 },
            ],
          },
        ].map((day, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-semibold text-stone-500 mb-3">{day.date}</h3>
            <div className="bg-white rounded-2xl divide-y divide-stone-100 shadow-sm border border-stone-100">
              {day.meals.map((meal, mealIdx) => (
                <div key={mealIdx} className="p-4 hover:bg-stone-50 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="text-xs text-stone-500">{meal.emoji} {meal.time}</span>
                      <h4 className="font-semibold text-stone-800 mb-1">{meal.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-stone-600">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < meal.rating ? 'text-yellow-400' : 'text-stone-300'}`}>⭐</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" /> {meal.calories} kcal
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="mt-8 text-center text-sm text-stone-400">
        <p>Dữ liệu lịch sử sẽ tự động cập nhật khi bạn nấu ăn</p>
      </div>
    </div>
  );
}
