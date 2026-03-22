import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Lock, RefreshCw, Share, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export function MealPlanDetailScreen() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('T2');

  const days = [
    { id: 'T2', date: '24/3' },
    { id: 'T3', date: '25/3' },
    { id: 'T4', date: '26/3' },
    { id: 'T5', date: '27/3' },
    { id: 'T6', date: '28/3' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={22} className="text-neutral-700" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900">24/3 – 30/3</h1>
        </div>
        <button className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
          Active <ChevronDown size={14} />
        </button>
      </div>

      {/* Days Tabs */}
      <div className="bg-white border-b border-neutral-100 px-2 py-2 flex gap-2 overflow-x-auto no-scrollbar z-10 sticky top-[60px]">
        {days.map((d) => (
          <button 
            key={d.id}
            onClick={() => setActiveDay(d.id)}
            className={`flex flex-col items-center min-w-[60px] py-2 rounded-xl transition-colors ${
              activeDay === d.id ? 'bg-orange-500 text-white shadow-md' : 'text-neutral-500 active:bg-neutral-50'
            }`}
          >
            <span className={`text-xs font-medium mb-1 ${activeDay === d.id ? 'text-orange-100' : ''}`}>{d.id}</span>
            <span className="text-sm font-bold">{d.date}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <h2 className="text-lg font-bold text-neutral-800 mb-4">{activeDay} ({days.find(d => d.id === activeDay)?.date})</h2>

        <div className="space-y-6">
          {/* Meal Slots */}
          {[
            { 
              time: 'Sáng', 
              locked: true,
              recipe: { title: 'Phở bò Hà Nội', time: '45p', cal: '450kcal', image: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBibyUyMHZpZXRuYW1lc2UlMjBub29kbGUlMjBzb3VwfGVufDF8fHx8MTc3NDA4MjQyNnww&ixlib=rb-4.1.0&q=80&w=1080' }
            },
            { 
              time: 'Trưa', 
              locked: false,
              recipe: { title: 'Cơm rang dưa bò', time: '20p', cal: '520kcal', image: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb20lMjB0YW0lMjBicm9rZW4lMjByaWNlJTIwcG9ya3xlbnwxfHx8fDE3NzQwODI0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080' }
            },
            { 
              time: 'Tối', 
              locked: false,
              recipe: { title: 'Canh chua cá lóc', time: '25p', cal: '380kcal', image: 'https://images.unsplash.com/photo-1665594051407-7385d281ad76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5oJTIwY2h1YSUyMHNvdXIlMjBzb3VwfGVufDF8fHx8MTc3NDA4MjQyNnww&ixlib=rb-4.1.0&q=80&w=1080' }
            }
          ].map((slot, i) => (
            <div key={i}>
              <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2">{slot.time}</h3>
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-neutral-100 flex gap-4 items-center active:bg-neutral-50 transition-colors">
                <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0">
                  <img src={slot.recipe.image} alt={slot.recipe.title} className="w-full h-full object-cover" />
                  {slot.locked && (
                    <div className="absolute top-1 left-1 w-6 h-6 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Lock size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-neutral-900 leading-tight mb-1.5">{slot.recipe.title}</h4>
                  <div className="flex gap-3 text-xs text-neutral-500 font-medium">
                    <span>⏱ {slot.recipe.time}</span>
                    <span>🔥 {slot.recipe.cal}</span>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 active:bg-neutral-100">
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Summary */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-blue-900">Tổng ngày</h3>
            <span className="font-bold text-orange-500 text-lg">🔥 1,350kcal</span>
          </div>
          <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[68%] rounded-full"></div>
          </div>
          <p className="text-xs text-blue-700 mt-2 text-right font-medium">Đạt 68% mục tiêu (2000kcal)</p>
        </div>
      </div>

      {/* Floating Actions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white p-2 rounded-full shadow-lg border border-neutral-100 z-30">
        <button 
          onClick={() => navigate('/plan/shopping')}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium active:bg-neutral-200"
        >
          <RefreshCw size={16} /> Mua sắm
        </button>
        <div className="w-px h-6 bg-neutral-200"></div>
        <button className="w-10 h-10 bg-neutral-100 text-neutral-700 rounded-full flex items-center justify-center active:bg-neutral-200">
          <Share size={18} />
        </button>
        <button className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center active:bg-orange-200">
          <BarChart2 size={18} />
        </button>
      </div>
    </div>
  );
}
