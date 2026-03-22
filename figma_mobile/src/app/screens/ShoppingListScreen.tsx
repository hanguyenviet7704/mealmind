import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Share, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ShoppingListScreen() {
  const navigate = useNavigate();
  
  // Mock items
  const initialItems = [
    { id: 1, name: 'Thịt bò nạm', qty: '500g', cat: 'Thịt cá', checked: false },
    { id: 2, name: 'Ức gà', qty: '400g', cat: 'Thịt cá', checked: false },
    { id: 3, name: 'Cá lóc', qty: '300g', cat: 'Thịt cá', checked: true },
    { id: 4, name: 'Hành tây', qty: '3 củ', cat: 'Rau củ', checked: false },
    { id: 5, name: 'Cà chua', qty: '500g', cat: 'Rau củ', checked: false },
    { id: 6, name: 'Hành lá', qty: '1 bó', cat: 'Rau củ', checked: true },
    { id: 7, name: 'Nước mắm', qty: '1 chai', cat: 'Gia vị', checked: true },
    { id: 8, name: 'Hoa hồi', qty: '5 cái', cat: 'Gia vị', checked: false },
  ];

  const [items, setItems] = useState(initialItems);

  const toggleCheck = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const categories = Array.from(new Set(items.map(i => i.cat)));
  const totalChecked = items.filter(i => i.checked).length;
  const progress = (totalChecked / items.length) * 100;

  return (
    <div className="flex-1 flex flex-col h-full bg-white safe-top">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 leading-tight">Danh sách mua sắm</h1>
            <p className="text-xs text-neutral-500">Tuần 24/3</p>
          </div>
        </div>
        <button className="p-2 text-neutral-700 active:bg-neutral-100 rounded-full">
          <Share size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Progress */}
        <div className="p-5 border-b border-neutral-100 bg-neutral-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-neutral-700">Đã mua: {totalChecked}/{items.length} món</span>
            <span className="text-sm font-bold text-orange-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2.5 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* List */}
        <div className="p-5 pb-24 space-y-8">
          {categories.map(cat => {
            const catItems = items.filter(i => i.cat === cat);
            const catIcons: Record<string, string> = { 'Thịt cá': '🥩', 'Rau củ': '🥬', 'Gia vị': '🧂' };
            
            return (
              <div key={cat}>
                <h2 className="text-base font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <span>{catIcons[cat]}</span> {cat} <span className="text-neutral-400 font-normal text-sm">({catItems.length})</span>
                </h2>
                
                <div className="space-y-1">
                  {catItems.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                        item.checked ? 'bg-neutral-50 opacity-60' : 'bg-white border border-neutral-100 shadow-sm active:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.checked ? (
                          <CheckCircle2 size={22} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle size={22} className="text-neutral-300 flex-shrink-0" />
                        )}
                        <span className={`font-medium ${item.checked ? 'text-neutral-500 line-through' : 'text-neutral-800'}`}>
                          {item.name}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${item.checked ? 'text-neutral-400' : 'text-neutral-900'}`}>
                        {item.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
