import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export function ComboScreen() {
  const navigate = useNavigate();
  const [showSwapModal, setShowSwapModal] = useState(false);
  
  const combos = [
    { type: 'Món chính', name: 'Cá kho tộ', time: '40p', cal: '380', img: 'https://images.unsplash.com/photo-1760445529233-ff4bd543270e?w=300&h=300&fit=crop' },
    { type: 'Canh', name: 'Canh chua cá lóc', time: '25p', cal: '210', img: 'https://images.unsplash.com/photo-1665594051407-7385d281ad76?w=300&h=300&fit=crop' },
    { type: 'Rau', name: 'Rau muống xào tỏi', time: '10p', cal: '120', img: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?w=300&h=300&fit=crop' },
    { type: 'Tráng miệng', name: 'Chè đậu đen', time: '0p', cal: '340', img: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=300&h=300&fit=crop' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top relative">
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900">Combo bữa trưa</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6 flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-orange-800">Tổng năng lượng</span>
            <div className="text-2xl font-bold text-orange-600">🔥 1,050 kcal</div>
          </div>
          <div className="text-right text-xs font-bold text-orange-700/70">
            <div>P: 65g</div>
            <div>C: 95g</div>
            <div>F: 35g</div>
          </div>
        </div>

        <div className="space-y-6">
          {combos.map((item, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px bg-neutral-200 flex-1"></div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2">{item.type}</span>
                <div className="h-px bg-neutral-200 flex-1"></div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-3">
                <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 leading-tight mb-1">{item.name}</h3>
                  <div className="text-xs text-neutral-500 font-medium">⏱ {item.time} &nbsp;·&nbsp; 🔥 {item.cal}</div>
                </div>
                <button 
                  onClick={() => setShowSwapModal(true)}
                  className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-500 active:bg-neutral-100"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-10 flex gap-3">
        <button className="w-14 h-14 rounded-2xl border border-neutral-200 flex items-center justify-center text-neutral-600 active:bg-neutral-50">
          <RefreshCw size={24} />
        </button>
        <button className="flex-1 bg-orange-500 text-white font-bold text-lg rounded-2xl active:bg-orange-600 shadow-sm">
          ✓ Chọn combo này
        </button>
      </div>

      {/* Swap Bottom Sheet (Mock) */}
      {showSwapModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSwapModal(false)}></div>
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }}
            className="bg-white rounded-t-3xl pb-safe relative z-10 max-h-[80%]"
          >
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-3"></div>
            <div className="px-5 pb-3 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Đổi {combos[0].type}</h3>
              <button onClick={() => setShowSwapModal(false)} className="text-neutral-500">Đóng</button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-3 p-3 border border-neutral-100 rounded-xl active:bg-neutral-50">
                  <img src={combos[i]?.img || combos[0].img} className="w-16 h-16 rounded-lg object-cover"/>
                  <div className="flex-1">
                    <h4 className="font-bold">Món thay thế {i}</h4>
                    <p className="text-xs text-neutral-500 mt-1">⏱ 30p · 🔥 320</p>
                  </div>
                  <button className="px-4 bg-orange-50 text-orange-600 font-bold text-sm rounded-lg">Chọn</button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
