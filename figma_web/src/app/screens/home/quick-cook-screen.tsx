import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, Zap, Clock, Flame, Heart } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Badge } from '../../components/ui/badge';

const quickRecipes = [
  {
    id: 1,
    name: 'Bánh mì trứng ốp la',
    imageUrl: 'https://images.unsplash.com/photo-1715925717150-2a6d181d8846?w=400',
    cookTime: 10,
    calories: 320,
    mealType: 'breakfast',
    tags: ['Nhanh gọn', 'Sáng'],
  },
  {
    id: 2,
    name: 'Mì trộn tôm',
    imageUrl: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?w=400',
    cookTime: 12,
    calories: 380,
    mealType: 'lunch',
    tags: ['Nhanh gọn', 'Thanh nhẹ'],
  },
  {
    id: 3,
    name: 'Gỏi cuốn tôm thịt',
    imageUrl: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?w=400',
    cookTime: 15,
    calories: 280,
    mealType: 'lunch',
    tags: ['Healthy', '< 15 phút'],
  },
  {
    id: 4,
    name: 'Cơm chiên dương châu',
    imageUrl: 'https://images.unsplash.com/photo-1707535347953-6cf5a129d55c?w=400',
    cookTime: 15,
    calories: 450,
    mealType: 'dinner',
    tags: ['Nhanh gọn', 'Dễ làm'],
  },
];

const filterOptions = [
  { id: 'all', label: 'Tất cả' },
  { id: 'breakfast', label: 'Sáng' },
  { id: 'lunch', label: 'Trưa' },
  { id: 'dinner', label: 'Tối' },
];

export default function QuickCookScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredRecipes = selectedFilter === 'all'
    ? quickRecipes
    : quickRecipes.filter(r => r.mealType === selectedFilter);

  return (
    <div className="min-h-screen bg-stone-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 text-stone-600 hover:text-stone-800">
            <ChevronLeft className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <h1 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
            Nấu nhanh <Zap className="w-5 h-5 text-orange-500" />
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Description */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-stone-600 mb-2">
            <Clock className="w-5 h-5" />
            <p className="text-lg">Chỉ dưới 15 phút</p>
          </div>
          <p className="text-sm text-stone-500">Hoàn hảo cho những ngày bận rộn</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${selectedFilter === filter.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-orange-300'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-600 hover:text-orange-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {recipe.cookTime} phút
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-stone-800 mb-2 line-clamp-1">
                  {recipe.name}
                </h3>

                <div className="flex items-center gap-3 mb-3 text-sm text-stone-600">
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    {recipe.calories} kcal
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-4">
          <Button variant="outline" className="w-full sm:w-auto">
            Xem thêm →
          </Button>
        </div>
      </div>
    </div>
  );
}
