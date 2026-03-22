import React, { useState } from 'react';
import { ArrowLeft, Clock, Flame, Trash2, Calendar as CalIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

export function CookingHistoryScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 leading-tight">Lịch sử nấu ăn</h1>
            <p className="text-xs text-neutral-500">Tháng 3/2026: 45 món</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        {[
          {
            day: 'Hôm nay (21/3)', 
            items: [
              { name: 'Phở bò Hà Nội', type: 'Sáng', rate: 5, img: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=200&fit=crop' },
              { name: 'Cơm rang dưa bò', type: 'Trưa', rate: 4, img: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?w=200&fit=crop' }
            ]
          },
          {
            day: 'Hôm qua (20/3)', 
            items: [
              { name: 'Bún chả Hà Nội', type: 'Trưa', rate: 5, img: 'https://images.unsplash.com/photo-1763703544688-2ac7839b0659?w=200&fit=crop' }
            ]
          }
        ].map((grp, i) => (
          <div key={i}>
            <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
              <CalIcon size={16} /> {grp.day}
            </h2>
            <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden divide-y divide-neutral-100 shadow-sm">
              {grp.items.map((item, j) => (
                <div key={j} className="flex items-center gap-4 p-3 active:bg-neutral-50">
                  <img src={item.img} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 leading-tight mb-1">{item.name}</h3>
                    <p className="text-xs text-neutral-500 mb-1">Bữa {item.type}</p>
                    <div className="flex gap-1 text-orange-500 text-sm">
                      {Array(5).fill(0).map((_, k) => (
                        <span key={k}>{k < item.rate ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <button className="p-2 text-neutral-300 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="text-center py-4">
          <button className="px-4 py-2 bg-neutral-100 text-neutral-600 font-bold text-sm rounded-full">Tải thêm</button>
        </div>
      </div>
    </div>
  );
}
