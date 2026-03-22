import React, { useState } from 'react';
import { ArrowLeft, Flame, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import ReactCanvasConfetti from "canvas-confetti";

export function SurpriseScreen() {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(true);

  // Auto reveal after 2s
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSpinning(false);
      triggerConfetti();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const triggerConfetti = () => {
    ReactCanvasConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#fbbf24', '#fcd34d']
    });
  };

  const handleRetry = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      triggerConfetti();
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-900 safe-top text-white">
      <div className="px-4 py-3 flex items-center justify-between relative z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-white/10">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Surprise Me! 🎲</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <AnimatePresence mode="wait">
          {spinning ? (
            <motion.div
              key="spin"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="text-6xl animate-bounce mb-6">🎰</div>
              <h2 className="text-xl font-bold text-orange-400 animate-pulse">Đang tìm món ngon...</h2>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-full max-w-sm"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="h-64 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=600&h=600&fit=crop" 
                    alt="Phở" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5">
                    <h2 className="text-3xl font-bold text-white mb-2 shadow-sm">Phở bò Hà Nội</h2>
                    <div className="flex gap-3 text-white/90 text-sm font-medium">
                      <span className="flex items-center gap-1"><Clock size={16}/> 45p</span>
                      <span className="flex items-center gap-1"><Flame size={16}/> 520kcal</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-white text-neutral-800">
                  <div className="flex gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-bold uppercase">Miền Bắc</span>
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold uppercase">TB</span>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3">
                    <span className="text-xl">💡</span>
                    <p className="text-sm font-medium text-orange-900 leading-snug">
                      Đã lâu bạn chưa ăn món nước. Thử một bát phở nóng hổi cho ngày hôm nay nhé!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 pt-0 space-y-3 z-10">
        <button 
          disabled={spinning}
          onClick={() => navigate('/recipes/1')}
          className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-lg active:bg-orange-600 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
        >
          🍳 Nấu món này!
        </button>
        <button 
          disabled={spinning}
          onClick={handleRetry}
          className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold text-lg active:bg-white/20 disabled:opacity-50 transition-all"
        >
          🎲 Thử lại
        </button>
        <p className="text-center text-white/50 text-xs mt-4">Shake phone để thử lại! 📱</p>
      </div>
    </div>
  );
}
