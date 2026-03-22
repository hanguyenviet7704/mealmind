import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function DeleteAccountScreen() {
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState('');

  const isMatched = confirmText === 'XÓA TÀI KHOẢN';

  return (
    <div className="flex-1 flex flex-col h-full bg-white safe-top">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900">Xóa tài khoản</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle size={36} className="text-red-500" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-neutral-900 text-center mb-6">Cảnh báo nghiêm trọng</h2>

        <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-8">
          <p className="text-red-800 text-sm leading-relaxed">
            Việc xóa tài khoản sẽ có những tác động sau:
          </p>
          <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1 ml-1">
            <li>Xóa toàn bộ dữ liệu cá nhân vĩnh viễn.</li>
            <li>Xóa các hồ sơ gia đình, mục tiêu dinh dưỡng.</li>
            <li>Xóa lịch sử thực đơn và món ăn yêu thích.</li>
            <li className="font-bold">Hành động này KHÔNG THỂ hoàn tác.</li>
          </ul>
        </div>

        <div className="space-y-3 mb-8">
          <label className="text-sm font-bold text-neutral-700">
            Nhập <span className="text-red-600 bg-red-50 px-1 font-mono">XÓA TÀI KHOẢN</span> để xác nhận:
          </label>
          <input 
            type="text" 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="XÓA TÀI KHOẢN" 
            className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none uppercase font-mono" 
          />
        </div>

        <button 
          disabled={!isMatched}
          onClick={() => navigate('/login')}
          className={`w-full font-bold py-4 rounded-xl transition-all ${
            isMatched ? 'bg-red-500 text-white active:bg-red-600' : 'bg-neutral-200 text-neutral-400'
          }`}
        >
          Xóa vĩnh viễn tài khoản
        </button>
      </div>
    </div>
  );
}
