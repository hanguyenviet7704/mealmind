import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-white px-6 py-4 safe-top safe-bottom">
      <div className="flex items-center mb-10 pt-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:bg-neutral-100 rounded-full">
          <ArrowLeft size={24} className="text-neutral-700" />
        </button>
        <h1 className="text-xl font-bold text-neutral-900 ml-2">Quên mật khẩu</h1>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-8">
          {sent ? <Mail size={40} className="text-orange-500" /> : <Lock size={40} className="text-orange-500" />}
        </div>

        {!sent ? (
          <>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Tìm lại mật khẩu</h2>
            <p className="text-neutral-500 text-center mb-8">
              Nhập email bạn đã đăng ký để nhận liên kết đặt lại mật khẩu.
            </p>

            <div className="w-full relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-neutral-400" />
              </div>
              <input 
                type="email" 
                placeholder="lan@email.com"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>

            <button 
              onClick={() => setSent(true)}
              className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl active:opacity-80"
            >
              Gửi liên kết
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Kiểm tra hộp thư!</h2>
            <p className="text-neutral-500 text-center mb-8 px-4 leading-relaxed">
              Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Có hiệu lực trong 1 giờ.
            </p>

            <button 
              disabled
              className="w-full bg-neutral-100 text-neutral-400 font-bold py-3.5 rounded-xl mb-4"
            >
              Gửi lại (58s)
            </button>
            
            <button 
              onClick={() => navigate('/login')}
              className="text-orange-500 font-medium active:text-orange-600"
            >
              Quay lại đăng nhập
            </button>
          </>
        )}
      </div>
    </div>
  );
}
