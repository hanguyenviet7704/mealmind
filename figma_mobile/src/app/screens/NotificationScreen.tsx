import React from 'react';
import { ArrowLeft, Bell, Info, Check } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NotificationScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900">Thông báo</h1>
        </div>
        <button className="text-sm font-bold text-orange-500"><Check size={20}/></button>
      </div>

      <div className="bg-white px-4 py-2 border-b border-neutral-100 flex gap-4 text-sm font-bold">
        <button className="text-neutral-900 border-b-2 border-orange-500 pb-2 -mb-[9px]">Tất cả</button>
        <button className="text-neutral-400 pb-2">Chưa đọc (2)</button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider bg-neutral-50">Hôm nay</div>
        <div className="bg-white divide-y divide-neutral-100">
          <div className="flex gap-4 p-4 active:bg-neutral-50 bg-orange-50/30">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">🍳</div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-neutral-900 mb-1">Gợi ý bữa trưa</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">11:00</span>
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                </div>
              </div>
              <p className="text-sm text-neutral-600">Trưa nay bạn muốn thử món Bún chả Hà Nội siêu ngon không? Click để xem ngay.</p>
            </div>
          </div>
          
          <div className="flex gap-4 p-4 active:bg-neutral-50 bg-orange-50/30">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">📅</div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-neutral-900 mb-1">Thực đơn tuần mới</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">09:00</span>
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                </div>
              </div>
              <p className="text-sm text-neutral-600">Đã đến lúc lên thực đơn cho tuần sau (24/3 - 30/3) rồi đó!</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider bg-neutral-50">Hôm qua</div>
        <div className="bg-white divide-y divide-neutral-100">
          <div className="flex gap-4 p-4 active:bg-neutral-50 opacity-70">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-xl flex-shrink-0">⏱</div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-neutral-900 mb-1">Hết giờ!</h3>
                <span className="text-xs text-neutral-400">19:45</span>
              </div>
              <p className="text-sm text-neutral-600">Bước hầm xương của món Phở bò đã hoàn thành.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
