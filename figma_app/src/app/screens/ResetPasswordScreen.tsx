import React, { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-white px-6 py-4 safe-top safe-bottom">
      <div className="flex items-center mb-10 pt-2">
        <button onClick={() => navigate('/login')} className="p-2 -ml-2 active:bg-neutral-100 rounded-full">
          <ArrowLeft size={24} className="text-neutral-700" />
        </button>
        <h1 className="text-xl font-bold text-neutral-900 ml-2">Đặt lại mật khẩu</h1>
      </div>

      <div className="flex-1 flex flex-col items-center">
        {!done ? (
          <>
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Lock size={32} className="text-blue-500" />
            </div>

            <div className="w-full space-y-4">
              <div className="relative">
                <input 
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Mật khẩu mới"
                  className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button 
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400"
                >
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex gap-1">
                <div className="h-full w-1/3 bg-orange-500 rounded-full"></div>
                <div className="h-full w-1/3 bg-orange-500 rounded-full"></div>
                <div className="h-full w-1/3 bg-orange-500 rounded-full"></div>
              </div>
              <p className="text-xs text-green-600 font-medium text-right mt-1">Mạnh</p>

              <div className="relative mt-2">
                <input 
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button 
                onClick={() => setDone(true)}
                className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl mt-4 shadow-sm"
              >
                Đặt lại mật khẩu
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center -mt-20">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Thành công!</h2>
            <p className="text-neutral-500 mb-8">Mật khẩu của bạn đã được thay đổi.</p>
            
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-orange-500 text-white font-bold py-3.5 px-12 rounded-xl"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
