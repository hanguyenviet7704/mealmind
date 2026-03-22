import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ChangePasswordScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-white safe-top">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900">Đổi mật khẩu</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-neutral-700">Mật khẩu hiện tại</label>
          <input type="password" placeholder="••••••••" className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>

        <div className="h-px bg-neutral-100 my-2"></div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">Mật khẩu mới</label>
            <input type="password" placeholder="••••••••" className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">Xác nhận mật khẩu mới</label>
            <input type="password" placeholder="••••••••" className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl mt-4 active:opacity-80 transition-opacity"
        >
          Cập nhật mật khẩu
        </button>
      </div>
    </div>
  );
}
