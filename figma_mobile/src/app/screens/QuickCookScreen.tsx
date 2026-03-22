import React from 'react';
import { ArrowLeft, Clock, Flame, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';

export function QuickCookScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
          <ArrowLeft size={24} className="text-neutral-700" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-neutral-900 leading-tight">Nấu nhanh ⚡</h1>
          <p className="text-xs text-neutral-500">Các món nấu dưới 15 phút</p>
        </div>
      </div>

      <div className="bg-white border-b border-neutral-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        <button className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-sm font-bold shadow-sm">Sáng</button>
        <button className="px-4 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-sm font-bold">Trưa</button>
        <button className="px-4 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-sm font-bold">Tối</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2">Gợi ý cho bạn</h2>
        
        {[
          { title: 'Bánh mì trứng ốp la', time: '10p', cal: '320kcal', img: 'https://images.unsplash.com/photo-1760445529233-ff4bd543270e?w=400&fit=crop', reason: 'Nhanh gọn cho buổi sáng bận rộn' },
          { title: 'Mì gói xào rau', time: '8p', cal: '380kcal', img: 'https://images.unsplash.com/photo-1763703544688-2ac7839b0659?w=400&fit=crop', reason: 'Dọn tủ lạnh cuối tuần' },
          { title: 'Salad cá ngừ', time: '12p', cal: '280kcal', img: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=400&fit=crop', reason: 'Healthy và siêu tốc' }
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm flex flex-col active:scale-[0.98] transition-transform cursor-pointer" onClick={() => navigate('/recipes/1')}>
            <div className="flex gap-4 mb-3">
              <img src={item.img} className="w-24 h-24 rounded-xl object-cover" />
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-neutral-900 leading-tight">{item.title}</h3>
                  <button className="text-neutral-400 p-1"><Heart size={18}/></button>
                </div>
                <div className="flex gap-3 text-xs text-neutral-500 mt-2 font-medium">
                  <span className="flex items-center gap-1"><Clock size={14}/> {item.time}</span>
                  <span className="flex items-center gap-1"><Flame size={14}/> {item.cal}</span>
                </div>
                <div className="flex gap-1 mt-2">
                  <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded">Dễ</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-800 text-xs px-3 py-2 rounded-xl flex items-center gap-2">
              <span>💡</span> <span className="font-medium italic">"{item.reason}"</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
