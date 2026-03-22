import React from 'react';
import { Search, SlidersHorizontal, Clock, Flame, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';

const recipeList = [
  {
    id: 1,
    title: 'Phở bò Hà Nội',
    time: '45p',
    cal: '450kcal',
    region: 'Bắc',
    image: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBibyUyMHZpZXRuYW1lc2UlMjBub29kbGUlMjBzb3VwfGVufDF8fHx8MTc3NDA4MjQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    title: 'Bún chả',
    time: '30p',
    cal: '380kcal',
    region: 'Bắc',
    image: 'https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidW4lMjBjaGElMjBncmlsbGVkJTIwcG9yayUyMG5vb2RsZXN8ZW58MXx8fHwxNzc0MDgyNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    title: 'Cơm tấm',
    time: '25p',
    cal: '520kcal',
    region: 'Nam',
    image: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb20lMjB0YW0lMjBicm9rZW4lMjByaWNlJTIwcG9ya3xlbnwxfHx8fDE3NzQwODI0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4,
    title: 'Canh chua',
    time: '20p',
    cal: '210kcal',
    region: 'Nam',
    image: 'https://images.unsplash.com/photo-1665594051407-7385d281ad76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5oJTIwY2h1YSUyMHNvdXIlMjBzb3VwfGVufDF8fHx8MTc3NDA4MjQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
  }
];

export function RecipesScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-white safe-top">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-neutral-100 z-10 sticky top-0">
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <input 
            type="text" 
            placeholder="Tìm món ăn..."
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-700 whitespace-nowrap active:bg-neutral-50">
            Vùng miền <span className="text-neutral-400 text-xs">▼</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-700 whitespace-nowrap active:bg-neutral-50">
            Bữa ăn <span className="text-neutral-400 text-xs">▼</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-700 whitespace-nowrap active:bg-neutral-50">
            Độ khó <span className="text-neutral-400 text-xs">▼</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-neutral-500">342 món ăn</span>
          <button className="text-sm font-medium text-neutral-700 flex items-center gap-1">
            Sắp xếp <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-4">
          {recipeList.map((recipe) => (
            <div 
              key={recipe.id} 
              className="flex flex-col cursor-pointer active:opacity-80 transition-opacity"
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 shadow-sm border border-neutral-100">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Heart size={14} className="text-neutral-600" />
                </div>
              </div>
              <h3 className="font-semibold text-neutral-900 leading-tight mb-1">{recipe.title}</h3>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                <span className="flex items-center gap-0.5"><Clock size={12}/> {recipe.time}</span>
                <span className="flex items-center gap-0.5"><Flame size={12}/> {recipe.cal}</span>
              </div>
              <div className="flex gap-1 mt-auto">
                <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-medium">{recipe.region}</span>
              </div>
            </div>
          ))}
          {/* Duplicating for scroll demo */}
          {recipeList.map((recipe) => (
            <div 
              key={`dup-${recipe.id}`} 
              className="flex flex-col cursor-pointer active:opacity-80 transition-opacity"
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 shadow-sm border border-neutral-100">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Heart size={14} className="text-neutral-600" />
                </div>
              </div>
              <h3 className="font-semibold text-neutral-900 leading-tight mb-1">{recipe.title}</h3>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                <span className="flex items-center gap-0.5"><Clock size={12}/> {recipe.time}</span>
                <span className="flex items-center gap-0.5"><Flame size={12}/> {recipe.cal}</span>
              </div>
              <div className="flex gap-1 mt-auto">
                <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-medium">{recipe.region}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
