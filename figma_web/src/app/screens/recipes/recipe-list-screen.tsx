import { useState } from 'react';
import { Link } from 'react-router';
import { Search, SlidersHorizontal, Heart, Clock, Flame, ChevronRight } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { TopNav } from '../../components/ui/top-nav';
import { motion } from 'motion/react';

const mockRecipes = [
  {
    id: 1,
    name: 'Phở bò Hà Nội',
    imageUrl: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?w=800',
    cookTime: 45,
    calories: 450,
    cuisine: 'Miền Bắc',
    difficulty: 'Trung bình',
    isBookmarked: true,
  },
  {
    id: 2,
    name: 'Bún chả Hà Nội',
    imageUrl: 'https://images.unsplash.com/photo-1597345637412-9fd611e758f3?w=800',
    cookTime: 30,
    calories: 380,
    cuisine: 'Miền Bắc',
    difficulty: 'Dễ',
    isBookmarked: false,
  },
  {
    id: 3,
    name: 'Cơm tấm sườn',
    imageUrl: 'https://images.unsplash.com/photo-1707535347953-6cf5a129d55c?w=800',
    cookTime: 25,
    calories: 520,
    cuisine: 'Miền Nam',
    difficulty: 'Dễ',
    isBookmarked: false,
  },
  {
    id: 4,
    name: 'Bánh mì thịt nướng',
    imageUrl: 'https://images.unsplash.com/photo-1715925717150-2a6d181d8846?w=800',
    cookTime: 20,
    calories: 420,
    cuisine: 'Miền Nam',
    difficulty: 'Dễ',
    isBookmarked: true,
  },
  {
    id: 5,
    name: 'Gỏi cuốn tôm thịt',
    imageUrl: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?w=800',
    cookTime: 25,
    calories: 280,
    cuisine: 'Miền Nam',
    difficulty: 'Dễ',
    isBookmarked: false,
  },
  {
    id: 6,
    name: 'Bún bò Huế',
    imageUrl: 'https://images.unsplash.com/photo-1597345637412-9fd611e758f3?w=800',
    cookTime: 50,
    calories: 580,
    cuisine: 'Miền Trung',
    difficulty: 'Trung bình',
    isBookmarked: false,
  },
];

const categories = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam', 'Món chay', 'Ăn kiêng'];

export default function RecipeListScreen() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <TopNav />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar - Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-orange-500" />
              Bộ Lọc
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-stone-800 mb-3">Tìm kiếm</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input 
                    placeholder="Tên món ăn, nguyên liệu..." 
                    className="pl-9 bg-stone-50 border-stone-200"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-stone-800 mb-3">Danh mục</h3>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        activeCategory === cat ? 'bg-orange-500 border-orange-500' : 'border-stone-300 group-hover:border-orange-400'
                      }`}>
                        {activeCategory === cat && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className={`text-sm ${activeCategory === cat ? 'text-stone-900 font-medium' : 'text-stone-600'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-stone-800 mb-3">Thời gian nấu</h3>
                <div className="flex flex-col gap-2">
                  {['Dưới 15 phút', '15 - 30 phút', '30 - 60 phút', 'Trên 60 phút'].map((time) => (
                    <label key={time} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-full border border-stone-300 group-hover:border-orange-400 transition-colors" />
                      <span className="text-sm text-stone-600">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-orange-50 text-orange-600 hover:bg-orange-100 border-none shadow-none">
                Áp dụng bộ lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Recipe Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 mb-2">Tất cả món ăn</h1>
              <p className="text-stone-600">Hiển thị {mockRecipes.length} công thức phù hợp</p>
            </div>
            <div className="hidden sm:block">
              <select className="bg-white border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 outline-none cursor-pointer">
                <option>Mới nhất</option>
                <option>Phổ biến nhất</option>
                <option>Thời gian nấu ngắn nhất</option>
                <option>Calories thấp nhất</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockRecipes.map((recipe, idx) => (
              <motion.div 
                key={recipe.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/recipes/${recipe.id}`} className="block group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all group-hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/70 backdrop-blur-md text-stone-600 hover:text-red-500 hover:bg-white transition-colors z-10">
                        <Heart className={`w-4 h-4 ${recipe.isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                      <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-stone-800 border-none shadow-sm">{recipe.cuisine}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-stone-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {recipe.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-stone-500 mt-4 pt-4 border-t border-stone-100">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-blue-500" /> {recipe.cookTime}p</span>
                          <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" /> {recipe.calories} kcal</span>
                        </div>
                        <span className="text-orange-600 group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="text-stone-600 border-stone-200">
              Xem thêm món ăn
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}