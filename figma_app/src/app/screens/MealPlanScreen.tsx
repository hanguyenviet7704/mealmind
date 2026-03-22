import React from 'react';
import { Calendar, ChevronRight, Lock, Plus, RefreshCw, Share, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export function MealPlanScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-neutral-100">
        <h1 className="text-xl font-bold text-neutral-900">Thực đơn</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-6">
        
        {/* Active Plan */}
        <div>
          <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Đang dùng
          </h2>
          
          <div 
            onClick={() => navigate('/plan/active')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Calendar size={18} className="text-orange-500" />
                  Tuần 24/3 – 30/3
                </h3>
                <p className="text-sm text-neutral-500 mt-1">21 món ăn · Avg 1,950 kcal/ngày</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center">
                <ChevronRight size={18} className="text-neutral-400" />
              </div>
            </div>
            
            <div className="flex gap-2 mb-1">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                <div key={d} className={`flex-1 h-1.5 rounded-full ${i < 2 ? 'bg-green-500' : 'bg-neutral-200'}`}></div>
              ))}
            </div>
            <p className="text-xs text-neutral-400 text-right mt-2">Hôm nay: T3</p>
          </div>
        </div>

        {/* Draft Plan */}
        <div>
          <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span> Nháp
          </h2>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Calendar size={18} className="text-neutral-400" />
                  Tuần 31/3 – 6/4
                </h3>
                <p className="text-sm text-neutral-500 mt-1">15/21 món đã chọn</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center">
                <ChevronRight size={18} className="text-neutral-400" />
              </div>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 mb-1">
              <div className="bg-orange-400 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => navigate('/plan/nutrition')} className="flex-1 bg-white border border-neutral-200 rounded-xl p-4 shadow-sm active:bg-neutral-50 flex items-center justify-between">
            <span className="font-bold text-neutral-800">Dinh dưỡng tuần</span>
            <ChevronRight size={18} className="text-neutral-400" />
          </button>
        </div>

        {/* Create Action */}
        <button 
          onClick={() => navigate('/plan/create')}
          className="w-full border-2 border-dashed border-neutral-300 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-neutral-500 font-medium active:bg-neutral-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 mb-1">
            <Plus size={20} />
          </div>
          Tạo thực đơn mới
        </button>

      </div>
    </div>
  );
}
