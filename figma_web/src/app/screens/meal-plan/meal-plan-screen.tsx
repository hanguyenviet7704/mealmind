import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, ChevronLeft, ChevronRight, MoreVertical, Flame, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { TopNav } from '../../components/ui/top-nav';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { motion } from 'motion/react';

const mockMealPlan = [
  {
    day: 'Thứ 2',
    date: '15/04',
    isToday: true,
    meals: {
      breakfast: null,
      lunch: {
        id: 1,
        name: 'Cơm tấm sườn nướng',
        imageUrl: 'https://images.unsplash.com/photo-1707535347953-6cf5a129d55c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY29tJTIwdGFtJTIwcmljZXxlbnwxfHx8fDE3NzQwODgzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        calories: 550,
        cookTime: 30
      },
      dinner: {
        id: 2,
        name: 'Phở Bò',
        imageUrl: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMHBobyUyMGJvd2x8ZW58MXx8fHwxNzc0MDg4MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        calories: 520,
        cookTime: 45
      }
    }
  },
  {
    day: 'Thứ 3',
    date: '16/04',
    isToday: false,
    meals: { breakfast: null, lunch: null, dinner: null }
  },
  { day: 'Thứ 4', date: '17/04', isToday: false, meals: { breakfast: null, lunch: null, dinner: null } },
  { day: 'Thứ 5', date: '18/04', isToday: false, meals: { breakfast: null, lunch: null, dinner: null } },
  { day: 'Thứ 6', date: '19/04', isToday: false, meals: { breakfast: null, lunch: null, dinner: null } },
  { day: 'Thứ 7', date: '20/04', isToday: false, meals: { breakfast: null, lunch: null, dinner: null } },
  { day: 'Chủ Nhật', date: '21/04', isToday: false, meals: { breakfast: null, lunch: null, dinner: null } },
];

export default function MealPlanScreen() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);

  const currentDay = mockMealPlan[selectedDay];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <TopNav />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar - Weekly Calendar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-stone-900">Tháng 4, 2024</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-stone-50 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 bg-stone-50 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {mockMealPlan.map((day, idx) => {
                const isSelected = selectedDay === idx;
                const hasMeals = day.meals.breakfast || day.meals.lunch || day.meals.dinner;
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      isSelected 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200' 
                        : 'hover:bg-orange-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        isSelected ? 'bg-white/20' : 'bg-stone-100 text-stone-900'
                      }`}>
                        {day.date.split('/')[0]}
                      </div>
                      <div className="text-left">
                        <div className={`font-semibold ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                          {day.day}
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-orange-100' : 'text-stone-500'}`}>
                          {hasMeals ? 'Đã lên thực đơn' : 'Chưa có thực đơn'}
                        </div>
                      </div>
                    </div>
                    {hasMeals && (
                      <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
            <h3 className="font-bold text-orange-900 mb-2">Thông số dinh dưỡng tuần</h3>
            <p className="text-sm text-orange-800 mb-4">Bạn đã đạt 45% mục tiêu calo trong tuần này.</p>
            <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <Button className="w-full mt-6 bg-white text-orange-600 hover:bg-orange-100 shadow-sm border border-orange-200">
              Xem báo cáo chi tiết
            </Button>
          </div>
        </div>

        {/* Main Content - Daily Meals */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                Thực đơn {currentDay.day.toLowerCase()} <Calendar className="w-5 h-5 text-stone-400" />
              </h1>
              <p className="text-stone-600 mt-1">Ngày {currentDay.date}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="text-stone-700 border-stone-200 hover:bg-stone-50">
                Xóa tất cả
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-sm">
                Tạo tự động ✨
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Breakfast */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:border-orange-200 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800">Bữa sáng</h3>
                    <span className="text-sm text-stone-500">6:00 - 9:00</span>
                  </div>
                </div>
              </div>
              
              {currentDay.meals.breakfast ? (
                <div>{/* Render Meal Card */}</div>
              ) : (
                <button 
                  onClick={() => navigate('/recipes')}
                  className="w-full h-32 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50/50 transition-all group"
                >
                  <div className="w-10 h-10 bg-stone-100 group-hover:bg-orange-100 rounded-full flex items-center justify-center mb-2 transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Thêm món ăn cho bữa sáng</span>
                </button>
              )}
            </div>

            {/* Lunch */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:border-orange-200 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-orange-400 rounded-full"></div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800">Bữa trưa</h3>
                    <span className="text-sm text-stone-500">11:00 - 13:00</span>
                  </div>
                </div>
              </div>
              
              {currentDay.meals.lunch ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-stone-100 bg-stone-50/50 group"
                >
                  <ImageWithFallback 
                    src={currentDay.meals.lunch.imageUrl} 
                    alt="Lunch"
                    className="w-full sm:w-40 h-40 sm:h-32 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-bold text-stone-800 mb-2 truncate">
                        {currentDay.meals.lunch.name}
                      </h4>
                      <button className="p-2 text-stone-400 hover:text-orange-500 rounded-full hover:bg-orange-50 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600 mb-4">
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{currentDay.meals.lunch.calories}</span> kcal
                      </span>
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{currentDay.meals.lunch.cookTime}</span> phút
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-fit text-orange-600 border-orange-200 hover:bg-orange-50">
                      Đổi món khác
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <button 
                  onClick={() => navigate('/recipes')}
                  className="w-full h-32 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50/50 transition-all group"
                >
                  <div className="w-10 h-10 bg-stone-100 group-hover:bg-orange-100 rounded-full flex items-center justify-center mb-2 transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Thêm món ăn cho bữa trưa</span>
                </button>
              )}
            </div>

            {/* Dinner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:border-orange-200 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-indigo-400 rounded-full"></div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800">Bữa tối</h3>
                    <span className="text-sm text-stone-500">18:00 - 20:00</span>
                  </div>
                </div>
              </div>
              
              {currentDay.meals.dinner ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-stone-100 bg-stone-50/50 group"
                >
                  <ImageWithFallback 
                    src={currentDay.meals.dinner.imageUrl} 
                    alt="Dinner"
                    className="w-full sm:w-40 h-40 sm:h-32 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-bold text-stone-800 mb-2 truncate">
                        {currentDay.meals.dinner.name}
                      </h4>
                      <button className="p-2 text-stone-400 hover:text-orange-500 rounded-full hover:bg-orange-50 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600 mb-4">
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{currentDay.meals.dinner.calories}</span> kcal
                      </span>
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{currentDay.meals.dinner.cookTime}</span> phút
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-fit text-orange-600 border-orange-200 hover:bg-orange-50">
                      Đổi món khác
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <button 
                  onClick={() => navigate('/recipes')}
                  className="w-full h-32 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50/50 transition-all group"
                >
                  <div className="w-10 h-10 bg-stone-100 group-hover:bg-orange-100 rounded-full flex items-center justify-center mb-2 transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Thêm món ăn cho bữa tối</span>
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}