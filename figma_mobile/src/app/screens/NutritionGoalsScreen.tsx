import React, { useState } from 'react';
import { ArrowLeft, Activity, Info } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NutritionGoalsScreen() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState('maintain');

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
          <ArrowLeft size={24} className="text-neutral-700" />
        </button>
        <h1 className="text-lg font-bold text-neutral-900">Mục tiêu dinh dưỡng</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24">
        {/* Presets */}
        <div className="space-y-3">
          {[
            { id: 'lose', icon: '📉', title: 'Giảm cân', desc: '-500 kcal so với TDEE' },
            { id: 'maintain', icon: '⚖️', title: 'Duy trì', desc: 'Ăn bằng mức tiêu hao' },
            { id: 'gain', icon: '📈', title: 'Tăng cân/Cơ', desc: '+500 kcal, tăng đạm' },
          ].map(g => (
            <div 
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
                goal === g.id ? 'border-orange-500 bg-orange-50' : 'border-neutral-200 bg-white'
              }`}
            >
              <div className="text-2xl">{g.icon}</div>
              <div className="flex-1">
                <div className={`font-bold ${goal === g.id ? 'text-orange-900' : 'text-neutral-800'}`}>{g.title}</div>
                <div className="text-xs text-neutral-500">{g.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${goal === g.id ? 'border-orange-500' : 'border-neutral-300'}`}>
                {goal === g.id && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
              </div>
            </div>
          ))}
        </div>

        {/* Calculated Targets */}
        <div>
          <h2 className="text-sm font-bold text-neutral-900 mb-3 flex items-center justify-between">
            <span>Mục tiêu hàng ngày</span>
            <span className="text-orange-500 text-xs cursor-pointer">Chỉnh sửa thủ công</span>
          </h2>
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-neutral-600">Năng lượng (Kcal)</span>
                <span className="font-bold text-orange-600 text-lg">2,000</span>
              </div>
              <input type="range" min="1200" max="3500" value="2000" className="w-full accent-orange-500" disabled />
            </div>
            
            <div className="pt-4 border-t border-neutral-100 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs font-bold text-blue-500 mb-1">Đạm</div>
                <div className="font-bold text-neutral-800 text-lg">120g</div>
                <div className="text-[10px] text-neutral-400">24%</div>
              </div>
              <div className="text-center border-l border-r border-neutral-100">
                <div className="text-xs font-bold text-orange-500 mb-1">Tinh bột</div>
                <div className="font-bold text-neutral-800 text-lg">250g</div>
                <div className="text-[10px] text-neutral-400">50%</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-green-500 mb-1">Chất béo</div>
                <div className="font-bold text-neutral-800 text-lg">58g</div>
                <div className="text-[10px] text-neutral-400">26%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 mt-4">
            <Info size={20} className="text-blue-500 flex-shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Mục tiêu được tính toán dựa trên chiều cao, cân nặng và giới tính trong hồ sơ của bạn.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-neutral-100 pb-safe">
        <button className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl">Lưu mục tiêu</button>
      </div>
    </div>
  );
}
