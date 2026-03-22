import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router';

export function CreatePlanScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/plan/active');
    }, 2500);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white safe-top safe-bottom p-6 text-center">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce">
          🍳
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Đang tạo thực đơn...</h2>
        <p className="text-neutral-500 max-w-[250px] mb-8">
          AI đang chọn 21 món phù hợp với khẩu vị và dinh dưỡng của bạn
        </p>
        <div className="w-full max-w-[200px] h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 animate-[pulse_1s_ease-in-out_infinite] w-2/3 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      <div className="px-4 py-4 bg-white border-b border-neutral-100 flex items-center gap-3 sticky top-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
          <ArrowLeft size={24} className="text-neutral-700" />
        </button>
        <h1 className="text-lg font-bold text-neutral-900">Tạo thực đơn mới</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <div className="mb-8">
          <label className="text-sm font-bold text-neutral-500 uppercase tracking-wider block mb-3">Tuần bắt đầu</label>
          <div className="bg-white rounded-2xl p-2 border border-neutral-200 flex items-center justify-between">
            <button className="p-3 active:bg-neutral-100 rounded-xl"><ChevronLeft size={20} className="text-neutral-500" /></button>
            <span className="font-bold text-lg text-neutral-900">T2, 31/3/2026</span>
            <button className="p-3 active:bg-neutral-100 rounded-xl"><ChevronRight size={20} className="text-neutral-500" /></button>
          </div>
        </div>

        <div className="mb-8">
          <label className="text-sm font-bold text-neutral-500 uppercase tracking-wider block mb-3">Tùy chọn</label>
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100">
            <label className="flex items-center justify-between p-4 cursor-pointer active:bg-neutral-50">
              <div>
                <div className="font-bold text-neutral-900">Ưu tiên món nấu nhanh</div>
                <div className="text-sm text-neutral-500">Dưới 30 phút chuẩn bị</div>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 accent-orange-500" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-4 cursor-pointer active:bg-neutral-50">
              <div>
                <div className="font-bold text-neutral-900">Bao gồm bữa phụ</div>
                <div className="text-sm text-neutral-500">Thêm trái cây, snack nhẹ</div>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 accent-orange-500" />
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-neutral-500 uppercase tracking-wider block mb-3 flex items-center justify-between">
            <span>Mục tiêu dinh dưỡng</span>
            <button className="text-orange-500 text-xs normal-case">Thay đổi</button>
          </label>
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                <Activity size={20} />
              </div>
              <div>
                <div className="font-bold text-blue-900 text-lg">Giảm cân nhẹ</div>
                <div className="text-sm text-blue-700 font-medium">Theo hồ sơ của bạn</div>
              </div>
            </div>
            <div className="flex gap-4 pt-3 border-t border-blue-200/50">
              <div className="flex-1">
                <div className="text-xs text-blue-600/80 font-bold mb-0.5">NĂNG LƯỢNG</div>
                <div className="font-bold text-blue-900">2,000 kcal</div>
              </div>
              <div className="w-px bg-blue-200/50"></div>
              <div className="flex-1">
                <div className="text-xs text-blue-600/80 font-bold mb-0.5">PROTEIN</div>
                <div className="font-bold text-blue-900">120g</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-5 bg-white border-t border-neutral-100 pb-safe z-10">
        <button 
          onClick={handleCreate}
          className="w-full py-4 bg-orange-500 text-white font-bold text-lg rounded-2xl active:bg-orange-600 shadow-sm flex items-center justify-center gap-2"
        >
          🍳 Tạo thực đơn
        </button>
      </div>
    </div>
  );
}
