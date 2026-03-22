import React, { useState } from 'react';
import { ArrowLeft, Edit2, Check, User } from 'lucide-react';
import { useNavigate } from 'react-router';

export function EditProfileScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-white safe-top">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900">Thông tin cá nhân</h1>
        </div>
        <button onClick={() => navigate(-1)} className="font-bold text-orange-500">Lưu</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full bg-neutral-100 mb-3 relative">
            <img src="https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?w=200&h=200&fit=crop" className="w-full h-full rounded-full object-cover" />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm">
              <Edit2 size={14} className="text-neutral-600" />
            </button>
          </div>
        </div>

        <form className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">Họ và tên</label>
            <input type="text" defaultValue="Chị Lan" className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">Email</label>
            <input type="email" defaultValue="lan@email.com" disabled className="w-full p-3.5 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 outline-none" />
            <p className="text-xs text-neutral-400 mt-1">Email dùng để đăng nhập, không thể thay đổi.</p>
          </div>

          <div className="space-y-1.5 pt-4">
            <label className="text-sm font-bold text-neutral-700">Giới tính</label>
            <div className="flex gap-3">
              <button type="button" className="flex-1 py-3 border-2 border-orange-500 bg-orange-50 text-orange-700 font-bold rounded-xl">Nữ</button>
              <button type="button" className="flex-1 py-3 border-2 border-neutral-200 bg-white text-neutral-600 font-bold rounded-xl">Nam</button>
              <button type="button" className="flex-1 py-3 border-2 border-neutral-200 bg-white text-neutral-600 font-bold rounded-xl">Khác</button>
            </div>
          </div>
          
          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-bold text-neutral-700">Chiều cao (cm)</label>
            <input type="number" defaultValue="160" className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700">Cân nặng (kg)</label>
            <input type="number" defaultValue="55" className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none" />
          </div>
        </form>
      </div>
    </div>
  );
}
