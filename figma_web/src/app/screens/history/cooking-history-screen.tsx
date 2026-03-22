import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, BarChart3, Flame, Calendar, TrendingUp, UtensilsCrossed } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const mockHistory = [
  {
    date: 'Hôm nay, 21/03',
    meals: [
      { time: 'Sáng', name: 'Phở bò Hà Nội', rating: 5, calories: 520 },
      { time: 'Trưa', name: 'Cơm tấm sườn', rating: 4, calories: 650 },
    ],
  },
  {
    date: 'Hôm qua, 20/03',
    meals: [
      { time: 'Sáng', name: 'Bánh mì trứng', rating: 3, calories: 380 },
      { time: 'Trưa', name: 'Bún chả Hà Nội', rating: 5, calories: 480 },
      { time: 'Tối', name: 'Canh chua cá', rating: 4, calories: 350 },
    ],
  },
];

export default function CookingHistoryScreen() {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);

  if (showStats) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button onClick={() => setShowStats(false)} className="p-2 hover:bg-stone-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-stone-800">Thống kê nấu ăn</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Cuisine Stats */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-stone-800 mb-4">Vùng miền hay nấu</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-stone-600">Miền Bắc</span>
                  <span className="text-sm font-semibold">45%</span>
                </div>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-stone-600">Miền Nam</span>
                  <span className="text-sm font-semibold">35%</span>
                </div>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-stone-600">Miền Trung</span>
                  <span className="text-sm font-semibold">15%</span>
                </div>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-300" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Average */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-stone-800 mb-4">Dinh dưỡng trung bình</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Calo</span>
                <span className="font-semibold">1,850 / 2,000 kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Protein</span>
                <span className="font-semibold">95 / 120g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Carbs</span>
                <span className="font-semibold">230 / 250g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Fat</span>
                <span className="font-semibold">55 / 65g</span>
              </div>
            </div>
          </div>

          {/* Top Recipes */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold text-stone-800 mb-4">Top 5 món nấu nhiều nhất</h3>
            <div className="space-y-3">
              {[
                { name: 'Phở bò', count: 12 },
                { name: 'Cơm tấm', count: 9 },
                { name: 'Bún chả', count: 7 },
                { name: 'Canh chua', count: 6 },
                { name: 'Cá kho', count: 5 },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-stone-700">{idx + 1}. {item.name}</span>
                  <Badge variant="secondary">{item.count} lần</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Streak */}
          <div className="bg-white rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-stone-800 mb-4">Cooking Streak</h3>
            <div className="text-center">
              <div className="text-4xl mb-2">🔥🔥🔥🔥🔥🔥🔥</div>
              <div className="text-2xl font-bold text-orange-500 mb-1">7 ngày liên tiếp</div>
              <div className="text-sm text-stone-600">Kỷ lục: 14 ngày</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-stone-800">Lịch sử nấu ăn</h1>
          </div>
          <button onClick={() => setShowStats(true)} className="p-2 hover:bg-stone-100 rounded-full">
            <BarChart3 className="w-5 h-5 text-orange-500" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Stats Banner */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">87</span>
              </div>
              <div className="text-xs text-stone-600">Món đã nấu</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">45</span>
              </div>
              <div className="text-xs text-stone-600">Ngày nấu</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-orange-600">⭐ 4.2</span>
              </div>
              <div className="text-xs text-stone-600">Đánh giá TB</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">7</span>
              </div>
              <div className="text-xs text-stone-600">Streak</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['Tất cả', 'Tuần này', 'Tháng này', 'Yêu thích'].map((tab) => (
            <button
              key={tab}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${tab === 'Tất cả'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-6">
          {mockHistory.map((day, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-stone-500 mb-3">{day.date}</h3>
              <div className="bg-white rounded-lg divide-y">
                {day.meals.map((meal, mealIdx) => (
                  <div key={mealIdx} className="p-4 hover:bg-stone-50 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-stone-500">
                            {meal.time === 'Sáng' ? '🌅' : meal.time === 'Trưa' ? '☀' : '🌙'} {meal.time}
                          </span>
                        </div>
                        <h4 className="font-semibold text-stone-800 mb-1">{meal.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-stone-600">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < meal.rating ? 'text-yellow-400' : 'text-stone-300'}>
                                ⭐
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="w-4 h-4" />
                            {meal.calories} kcal
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
      </div>
    </div>
  );
}
