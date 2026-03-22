import React from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router';

export function WeekNutritionScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 leading-tight">Dinh dưỡng tuần</h1>
            <p className="text-xs text-neutral-500">24/3 – 30/3</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm text-center">
            <div className="text-xs text-neutral-500 font-bold mb-1 uppercase">Trung bình</div>
            <div className="text-xl font-bold text-orange-600">1,920</div>
            <div className="text-[10px] text-neutral-400">kcal/ngày</div>
          </div>
          <div className="flex-1 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm text-center">
            <div className="text-xs text-neutral-500 font-bold mb-1 uppercase">Mục tiêu</div>
            <div className="text-xl font-bold text-neutral-800">2,000</div>
            <div className="text-[10px] text-neutral-400">kcal/ngày</div>
          </div>
          <div className="flex-1 bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
            <div className="text-xs text-green-700 font-bold mb-1 uppercase">Đạt</div>
            <div className="text-xl font-bold text-green-700">5/7</div>
            <div className="text-[10px] text-green-600">ngày</div>
          </div>
        </div>

        {/* Mock Chart Area */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-neutral-800 text-sm">Biểu đồ năng lượng</span>
            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
              <span className="w-2 h-2 bg-orange-200 rounded-full"></span> Mục tiêu 2000
            </div>
          </div>
          
          <div className="h-40 flex items-end justify-between gap-2 relative">
            <div className="absolute top-[20%] left-0 right-0 border-t-2 border-dashed border-orange-200 z-0"></div>
            {[
              { d: 'T2', v: 80, ok: true },
              { d: 'T3', v: 95, ok: true },
              { d: 'T4', v: 110, ok: false },
              { d: 'T5', v: 90, ok: true },
              { d: 'T6', v: 85, ok: true },
              { d: 'T7', v: 120, ok: false },
              { d: 'CN', v: 40, ok: true, active: true },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 z-10">
                <div 
                  className={`w-full max-w-[24px] rounded-t-sm transition-all ${
                    bar.active ? 'bg-orange-500' : bar.ok ? 'bg-green-400' : 'bg-red-400'
                  }`}
                  style={{ height: `${bar.v}%` }}
                ></div>
                <span className={`text-xs font-bold ${bar.active ? 'text-orange-600' : 'text-neutral-400'}`}>{bar.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Macros */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-5 shadow-sm">
          <h3 className="font-bold text-neutral-800 text-sm mb-2">Trung bình đa lượng (Macro)</h3>
          {[
            { label: '💪 Protein', val: '105/120g', pct: '88%', color: 'bg-blue-500', bar: 'w-[88%]', ok: true },
            { label: '🍚 Carbs', val: '230/250g', pct: '92%', color: 'bg-orange-500', bar: 'w-[92%]', ok: true },
            { label: '🧈 Fat', val: '58/65g', pct: '89%', color: 'bg-green-500', bar: 'w-[89%]', ok: true },
          ].map((m, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="text-neutral-700">{m.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-900 font-bold">{m.val}</span>
                  <span className="text-[10px] w-4">{m.ok ? '🟢' : '🔴'}</span>
                </div>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                <div className={`h-full ${m.color} ${m.bar} rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Day Details Accordion Mock */}
        <div>
          <h3 className="font-bold text-neutral-900 mb-3 text-sm uppercase tracking-wider ml-1">Chi tiết theo ngày</h3>
          <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100">
            <div className="p-4 active:bg-neutral-50">
              <div className="flex justify-between items-center font-bold text-neutral-800">
                <span className="text-orange-600">▾ T2 (24/3)</span>
                <div className="flex gap-2"><span>1,850 kcal</span> <span>🟢</span></div>
              </div>
              <div className="mt-3 pl-4 border-l-2 border-orange-200 space-y-2 text-sm text-neutral-600">
                <div className="flex justify-between"><span>Sáng: Phở bò</span> <span>450 kcal</span></div>
                <div className="flex justify-between"><span>Trưa: Cơm rang</span> <span>520 kcal</span></div>
                <div className="flex justify-between"><span>Tối: Canh chua</span> <span>380 kcal</span></div>
              </div>
            </div>
            {['T3 (25/3)', 'T4 (26/3)'].map((d, i) => (
              <div key={d} className="p-4 flex justify-between items-center font-bold text-neutral-600 active:bg-neutral-50">
                <span>▸ {d}</span>
                <div className="flex gap-2"><span>2,050 kcal</span> <span>{i === 0 ? '🔴' : '🟢'}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
