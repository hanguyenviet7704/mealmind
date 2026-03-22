import React, { useState } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router';

export function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  return (
    <div className="flex-1 flex flex-col h-full bg-white safe-top">
      {/* Header with Search */}
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full text-neutral-700">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm món, nguyên liệu..."
            className="w-full pl-9 pr-10 py-2.5 bg-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!query ? (
          <>
            <div className="mb-8">
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Tìm kiếm gần đây</h3>
              <div className="flex flex-wrap gap-2">
                {['phở bò', 'bún chả', 'cơm tấm'].map(q => (
                  <button key={q} onClick={() => setQuery(q)} className="px-4 py-2 bg-neutral-100 rounded-full text-sm font-medium text-neutral-700 flex items-center gap-2">
                    {q} <X size={14} className="text-neutral-400" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Phổ biến</h3>
              <div className="flex flex-wrap gap-2">
                {['Phở', 'Bún', 'Cơm', 'Lẩu', 'Canh'].map(q => (
                  <button key={q} onClick={() => setQuery(q)} className="px-4 py-2 border border-neutral-200 rounded-full text-sm font-medium text-neutral-600">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-neutral-500 font-medium">15 kết quả cho "{query}"</span>
              <button className="text-sm text-orange-500 font-bold">Filter</button>
            </div>
            
            {/* Results */}
            {[1,2,3].map(i => (
              <div key={i} onClick={() => navigate('/recipes/1')} className="flex gap-4 p-3 bg-white border border-neutral-100 rounded-2xl shadow-sm cursor-pointer active:bg-neutral-50">
                <img 
                  src="https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=200&h=200&fit=crop" 
                  alt="Result" 
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1 py-1">
                  <h4 className="font-bold text-neutral-900 leading-tight mb-1">Phở bò {i === 1 ? 'Hà Nội' : i === 2 ? 'Nam Định' : 'tái lăn'}</h4>
                  <p className="text-xs text-neutral-500 mb-2">⏱ 45p · 🔥 450kcal</p>
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold uppercase">Miền Bắc</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
