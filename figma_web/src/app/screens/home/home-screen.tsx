import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Heart, X, Flame, Zap, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { TopNav } from '../../components/ui/top-nav';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';

const mockSuggestions = [
  {
    id: 1,
    name: 'Cơm tấm sườn nướng',
    imageUrl: 'https://images.unsplash.com/photo-1707535347953-6cf5a129d55c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY29tJTIwdGFtJTIwcmljZXxlbnwxfHx8fDE3NzQwODgzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    cookTime: 30,
    calories: 550,
    cuisine: 'Miền Nam',
    difficulty: 'Dễ',
    reason: 'Món quen thuộc miền Nam, nấu nhanh cho buổi trưa bận rộn',
    tags: ['Nhanh gọn', 'Comfort food'],
  },
  {
    id: 2,
    name: 'Phở Bò',
    imageUrl: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMHBobyUyMGJvd2x8ZW58MXx8fHwxNzc0MDg4MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    cookTime: 45,
    calories: 520,
    cuisine: 'Miền Bắc',
    difficulty: 'Trung bình',
    reason: 'Món truyền thống miền Bắc, đầy đủ dinh dưỡng',
    tags: ['Truyền thống', 'Ấm áp'],
  },
  {
    id: 3,
    name: 'Bún bò Huế',
    imageUrl: 'https://images.unsplash.com/photo-1597345637412-9fd611e758f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWV8ZW58MXx8fHwxNzc0MDg4MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    cookTime: 50,
    calories: 580,
    cuisine: 'Miền Trung',
    difficulty: 'Trung bình',
    reason: 'Hương vị đậm đà miền Trung, đủ cay vừa phải',
    tags: ['Cay', 'Đậm đà'],
  },
  {
    id: 4,
    name: 'Bánh mì thịt nướng',
    imageUrl: 'https://images.unsplash.com/photo-1715925717150-2a6d181d8846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMG1pJTIwc2FuZHdpY2h8ZW58MXx8fHwxNzc0MDg4MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    cookTime: 20,
    calories: 420,
    cuisine: 'Miền Nam',
    difficulty: 'Dễ',
    reason: 'Nhanh gọn, tiện lợi cho bữa sáng',
    tags: ['Nhanh gọn', '< 30 phút'],
  },
  {
    id: 5,
    name: 'Gỏi cuốn tôm thịt',
    imageUrl: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwc3ByaW5nJTIwcm9sbHN8ZW58MXx8fHwxNzc0MDg4MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    cookTime: 25,
    calories: 280,
    cuisine: 'Miền Nam',
    difficulty: 'Dễ',
    reason: 'Nhẹ nhàng, tươi mát, ít calories',
    tags: ['Healthy', 'Thanh nhẹ'],
  },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const [mealType, setMealType] = useState('lunch');

  useEffect(() => {
    // Auto-detect meal type based on time
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) setMealType('breakfast');
    else if (hour >= 10 && hour < 14) setMealType('lunch');
    else if (hour >= 14 && hour < 17) setMealType('snack');
    else if (hour >= 17 && hour < 22) setMealType('dinner');
    else setMealType('snack');
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <TopNav />

      {/* Hero Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Chào buổi {mealType === 'breakfast' ? 'sáng' : mealType === 'lunch' ? 'trưa' : mealType === 'dinner' ? 'tối' : 'phụ'}, Lan! 👋</h1>
            <p className="text-stone-600">Hôm nay bạn muốn nấu món gì? Khám phá ngay các gợi ý tốt nhất nhé.</p>
          </div>
          <div className="mt-4 md:mt-0 bg-orange-50 rounded-lg p-4 border border-orange-100 flex items-center gap-4 shadow-sm">
            <div className="bg-orange-100 p-2 rounded-full">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-stone-600 font-medium">Gợi ý hôm nay</p>
              <p className="text-lg font-bold text-orange-700">47/50 <span className="text-sm font-normal text-stone-500">(Free)</span></p>
            </div>
            <Button size="sm" variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-100">
              Nâng cấp Pro
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Tools */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Công cụ nhanh</h2>
            <button
              onClick={() => navigate('/combo')}
              className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex flex-col items-center justify-center text-center group hover:border-orange-200"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🍱</div>
              <div className="font-semibold text-stone-800 mb-1">Combo Gia Đình</div>
              <div className="text-sm text-stone-500">Gợi ý mâm cơm 3 món</div>
            </button>
            <button
              onClick={() => navigate('/surprise')}
              className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex flex-col items-center justify-center text-center group hover:border-orange-200"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎲</div>
              <div className="font-semibold text-stone-800 mb-1">Món Ngẫu Nhiên</div>
              <div className="text-sm text-stone-500">Khám phá món mới lạ</div>
            </button>
            <button
              onClick={() => navigate('/quick-cook')}
              className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex flex-col items-center justify-center text-center group hover:border-orange-200"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
              <div className="font-semibold text-stone-800 mb-1">Nấu Nhanh 15 Phút</div>
              <div className="text-sm text-stone-500">Giải pháp cho ngày bận</div>
            </button>
          </div>

          {/* Main Grid Recipes */}
          <div className="lg:col-span-3">
            {/* Meal Type Tabs */}
            <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`
                    px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border
                    ${mealType === type
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                    }
                  `}
                >
                  {type === 'breakfast' && 'Bữa Sáng'}
                  {type === 'lunch' && 'Bữa Trưa'}
                  {type === 'dinner' && 'Bữa Tối'}
                  {type === 'snack' && 'Ăn Vặt'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockSuggestions.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-stone-600 hover:text-orange-500 hover:bg-white transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">{recipe.cuisine}</Badge>
                      <Badge variant="outline" className="text-stone-500 border-stone-200">{recipe.difficulty}</Badge>
                    </div>

                    <h3 className="text-xl font-bold text-stone-800 mb-2">{recipe.name}</h3>
                    
                    <p className="text-sm text-stone-600 mb-4 line-clamp-2">{recipe.reason}</p>

                    <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-stone-500">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> {recipe.cookTime}p</span>
                        <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500" /> {recipe.calories} kcal</span>
                      </div>
                      <Link to={`/recipes/${recipe.id}`} className="text-orange-600 font-semibold text-sm flex items-center hover:text-orange-700">
                        Chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}