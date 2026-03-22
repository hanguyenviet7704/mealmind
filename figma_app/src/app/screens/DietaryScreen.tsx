import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router';

export function DietaryScreen() {
  const navigate = useNavigate();
  const [diets, setDiets] = useState(['bt']);
  const [allergens, setAllergens] = useState(['dp']);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900">Chế độ & Dị ứng</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-20 space-y-8">
        {/* Diet */}
        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-4">Chế độ ăn đặc biệt</h2>
          <div className="space-y-3">
            {[
              { id: 'bt', label: 'Bình thường', desc: 'Không giới hạn' },
              { id: 'chay', label: 'Chay (trứng+sữa)', desc: 'Không thịt cá' },
              { id: 'vegan', label: 'Thuần chay (Vegan)', desc: 'Không sp động vật' },
              { id: 'keto', label: 'Keto', desc: '< 20g carb/ngày' },
            ].map(d => {
              const isSel = diets.includes(d.id);
              return (
                <div 
                  key={d.id}
                  onClick={() => setDiets([d.id])} // Single select mock
                  className={`flex items-center p-4 rounded-xl border-2 transition-colors cursor-pointer ${isSel ? 'border-orange-500 bg-orange-50' : 'border-neutral-200 bg-white'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${isSel ? 'border-orange-500' : 'border-neutral-300'}`}>
                    {isSel && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
                  </div>
                  <div>
                    <div className={`font-bold ${isSel ? 'text-orange-900' : 'text-neutral-800'}`}>{d.label}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">{d.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Allergens */}
        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-4">Dị ứng cần tránh</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: 'hs', icon: '🦐', label: 'Hải sản' },
              { id: 'dp', icon: '🥜', label: 'Đậu phộng' },
              { id: 's', icon: '🥛', label: 'Sữa' },
              { id: 'g', icon: '🌾', label: 'Gluten' },
            ].map(a => {
              const isSel = allergens.includes(a.id);
              return (
                <button 
                  key={a.id}
                  onClick={() => setAllergens(prev => isSel ? prev.filter(x => x !== a.id) : [...prev, a.id])}
                  className={`px-4 py-2 rounded-xl border-2 font-medium flex items-center gap-2 ${isSel ? 'border-red-500 bg-red-50 text-red-700' : 'border-neutral-200 bg-white text-neutral-600'}`}
                >
                  <span>{a.icon}</span> {a.label}
                </button>
              )
            })}
          </div>
          
          <div className="relative">
            <input type="text" placeholder="+ Tìm nguyên liệu cần tránh..." className="w-full p-3.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
          </div>
        </section>

      </div>
      
      <div className="p-4 bg-white border-t border-neutral-100 pb-safe">
        <button className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl">Lưu thay đổi</button>
      </div>
    </div>
  );
}
