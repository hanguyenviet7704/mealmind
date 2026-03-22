import React from 'react';
import { ArrowLeft, PieChart, Info, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NutritionDetailScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
          <ArrowLeft size={24} className="text-neutral-700" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-neutral-900 leading-tight">Dinh dưỡng</h1>
          <p className="text-xs text-neutral-500">Phở bò Hà Nội</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
          <span className="font-bold text-neutral-800">Số người ăn:</span>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 active:bg-neutral-200">
              <Minus size={16} />
            </button>
            <span className="text-lg font-bold w-4 text-center">2</span>
            <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 active:bg-neutral-200">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col items-center shadow-sm">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-orange-500 flex items-center justify-center gap-1">
              <Flame size={28}/> 450
            </div>
            <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Kcal / khẩu phần</span>
          </div>

          <div className="w-32 h-32 rounded-full border-[12px] border-blue-500 relative flex items-center justify-center mb-6">
            <div className="absolute inset-[-12px] rounded-full border-[12px] border-orange-500 border-l-transparent border-t-transparent rotate-45"></div>
            <div className="absolute inset-[-12px] rounded-full border-[12px] border-green-500 border-r-transparent border-b-transparent -rotate-12"></div>
            <PieChart size={32} className="text-neutral-300" />
          </div>
          <div className="flex gap-4 text-sm font-bold">
            <span className="text-blue-600">P: 31%</span>
            <span className="text-orange-600">C: 38%</span>
            <span className="text-green-600">F: 31%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-5 shadow-sm">
          {[
            { label: '💪 Protein', val: '35.2g', pct: '70%', color: 'bg-blue-500', bar: 'w-[70%]' },
            { label: '🍚 Carbs', val: '42.8g', pct: '53%', color: 'bg-orange-500', bar: 'w-[53%]' },
            { label: '🧈 Fat', val: '15.3g', pct: '33%', color: 'bg-green-500', bar: 'w-[33%]' },
            { label: '🥬 Fiber', val: '4.6g', pct: '18%', color: 'bg-emerald-400', bar: 'w-[18%]' },
          ].map((m, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="text-neutral-700">{m.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-900 font-bold">{m.val}</span>
                  <span className="text-xs text-neutral-400 w-8 text-right">{m.pct}</span>
                </div>
              </div>
              <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                <div className={`h-full ${m.color} ${m.bar} rounded-full`}></div>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-sm font-medium text-neutral-600">
            <span>🧂 Sodium (Muối)</span>
            <span>680mg</span>
          </div>
        </div>

        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex gap-3 text-sm">
          <Info size={20} className="flex-shrink-0" />
          <p>Một số giá trị dinh dưỡng mang tính chất ước tính dựa trên nguyên liệu cơ bản.</p>
        </div>

        <div className="pb-10">
          <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">Chi tiết nguyên liệu</h3>
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden divide-y divide-neutral-100">
            {[
              { n: 'Ức gà (200g)', k: '280kcal', m: 'P:52g C:0g' },
              { n: 'Bánh phở (400g)', k: '240kcal', m: 'P:4g C:54g' }
            ].map((ing, i) => (
              <div key={i} className="p-4 active:bg-neutral-50 cursor-pointer">
                <div className="font-bold text-neutral-800">{ing.n}</div>
                <div className="text-xs text-neutral-500 mt-1">{ing.k} · {ing.m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple local mock for Flame
function Flame(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>;
}
