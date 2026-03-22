import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Clock, Flame, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router';

// Using unsplash photos based on findings
const recipes = [
  {
    id: 1,
    title: 'Phở bò Hà Nội',
    time: '45p',
    cal: '450kcal',
    region: 'Miền Bắc',
    difficulty: 'Dễ',
    image: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBibyUyMHZpZXRuYW1lc2UlMjBub29kbGUlMjBzb3VwfGVufDF8fHx8MTc3NDA4MjQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    reason: 'Món nước thanh thanh, lý tưởng cho buổi sáng.'
  },
  {
    id: 2,
    title: 'Cơm tấm sườn nướng',
    time: '30p',
    cal: '550kcal',
    region: 'Miền Nam',
    difficulty: 'Trung bình',
    image: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb20lMjB0YW0lMjBicm9rZW4lMjByaWNlJTIwcG9ya3xlbnwxfHx8fDE3NzQwODI0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    reason: 'Món quen thuộc miền Nam, đậm đà đưa cơm.'
  },
  {
    id: 3,
    title: 'Bún chả Hà Nội',
    time: '40p',
    cal: '520kcal',
    region: 'Miền Bắc',
    difficulty: 'Trung bình',
    image: 'https://images.unsplash.com/photo-1763703544688-2ac7839b0659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidW4lMjBjaGElMjBncmlsbGVkJTIwcG9yayUyMG5vb2RsZXN8ZW58MXx8fHwxNzc0MDgyNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    reason: 'Đổi v��� với món nướng thơm lừng.'
  }
];

export function HomeScreen() {
  const [cards, setCards] = useState(recipes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < cards.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 overflow-hidden relative safe-top safe-bottom">
      {/* Header */}
      <div className="px-5 pt-4 pb-2 z-10 bg-neutral-50 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Chào buổi trưa, Lan!</h1>
          <p className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5">
            <span>🌤️ 28°C TP.HCM</span>
          </p>
        </div>
        <button onClick={() => navigate('/search')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100 text-neutral-600">
          <Search size={20} />
        </button>
      </div>

      <div className="px-5 pb-2 bg-neutral-50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm border border-neutral-100 mt-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 border-2 border-orange-500">👩</div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 -ml-3">👦</div>
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 -ml-3">👧</div>
          </div>
        </div>

        {/* Meal Type Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => navigate('/quick-cook')} className="px-3 py-1.5 rounded-full text-sm font-bold bg-amber-100 text-amber-700 whitespace-nowrap">
            ⚡ Nấu nhanh
          </button>
          {['Sáng', 'Trưa', 'Tối', 'Phụ'].map((meal, idx) => (
            <button 
              key={meal}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                idx === 1 ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-neutral-600 border border-neutral-200'
              }`}
            >
              {idx === 1 && <span className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-white"></span>}
              {meal}
            </button>
          ))}
        </div>
      </div>

      {/* Card Stack Area */}
      <div className="flex-1 relative flex items-center justify-center px-5 perspective-1000 mt-2 mb-6 z-0">
        <AnimatePresence>
          {currentCard ? (
            <motion.div
              key={currentCard.id}
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0, rotate: -15 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x > 100 || velocity.x > 500) handleSwipe('right');
                else if (offset.x < -100 || velocity.x < -500) handleSwipe('left');
              }}
              className="w-full max-w-sm aspect-[4/5] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden absolute border border-neutral-100 touch-none cursor-grab active:cursor-grabbing"
              onClick={() => navigate(`/recipes/${currentCard.id}`)}
            >
              <div className="h-2/3 relative">
                <img src={currentCard.image} alt={currentCard.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Heart className="text-white" size={20} />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-2xl font-bold mb-2 shadow-sm">{currentCard.title}</h2>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full"><Clock size={14}/> {currentCard.time}</span>
                    <span className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full"><Flame size={14}/> {currentCard.cal}</span>
                  </div>
                </div>
              </div>
              <div className="h-1/3 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold uppercase tracking-wide">{currentCard.region}</span>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wide">{currentCard.difficulty}</span>
                  </div>
                  <div className="flex gap-3 items-start bg-blue-50/50 p-3 rounded-xl border border-blue-50">
                    <span className="text-lg">💡</span>
                    <p className="text-sm text-blue-900/80 font-medium leading-relaxed italic">"{currentCard.reason}"</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <ChefHat size={32} />
              </div>
              <p>Hết gợi ý hôm nay!</p>
              <button 
                onClick={() => setCurrentIndex(0)}
                className="mt-4 px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-medium"
              >
                Xem lại từ đầu
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* Stack Background elements to simulate deck */}
        {currentCard && currentIndex + 1 < cards.length && (
          <div className="w-[90%] aspect-[4/5] bg-white rounded-3xl shadow-sm absolute -z-10 translate-y-4 scale-95 border border-neutral-200 pointer-events-none"></div>
        )}
        {currentCard && currentIndex + 2 < cards.length && (
          <div className="w-[80%] aspect-[4/5] bg-white rounded-3xl shadow-sm absolute -z-20 translate-y-8 scale-90 border border-neutral-200 pointer-events-none opacity-50"></div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="px-5 pb-6 flex justify-between gap-3 relative z-10 bg-neutral-50 pt-2">
        <button onClick={() => navigate('/surprise')} className="flex-1 bg-white border border-neutral-200 rounded-xl py-3 flex items-center justify-center gap-2 shadow-sm font-medium text-neutral-700 active:bg-neutral-50 transition-colors">
          <span className="text-xl">🎲</span> Surprise
        </button>
        <button onClick={() => navigate('/combo')} className="flex-1 bg-orange-50 border border-orange-200 rounded-xl py-3 flex items-center justify-center gap-2 shadow-sm font-medium text-orange-700 active:bg-orange-100 transition-colors">
          <span className="text-xl">🍱</span> Combo
        </button>
      </div>
    </div>
  );
}
