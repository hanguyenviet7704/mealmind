import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, ChefHat, Mail, Lock } from 'lucide-react';

export function LoginScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white px-6 py-8 safe-top safe-bottom overflow-y-auto">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col items-center mt-12 mb-10">
          <div className="bg-orange-50 p-4 rounded-3xl mb-4 border border-orange-100 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 6C15.1634 6 8 13.1634 8 22V26H40V22C40 13.1634 32.8366 6 24 6Z" fill="#F97316"/>
              <path d="M12 26H36V32C36 36.4183 32.4183 40 28 40H20C15.5817 40 12 36.4183 12 32V26Z" fill="#FDBA74"/>
              <path d="M24 10C24 10 21 14 21 18H27C27 14 24 10 24 10Z" fill="white"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">MealMind</h1>
          <p className="text-neutral-500 mt-1">Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-neutral-400" />
              </div>
              <input 
                type="email" 
                placeholder="lan@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                defaultValue="lan@email.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-neutral-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                defaultValue="password123"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff size={20} className="text-neutral-400" /> : <Eye size={20} className="text-neutral-400" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 accent-orange-500" defaultChecked />
              <span className="text-sm text-neutral-600">Ghi nhớ đăng nhập</span>
            </label>
            <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm font-medium text-orange-500">
              Quên mật khẩu?
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3.5 rounded-xl mt-4 active:opacity-80 transition-opacity"
          >
            Đăng nhập
          </button>
        </form>

        <div className="relative flex items-center py-6 mt-2">
          <div className="flex-grow border-t border-neutral-200"></div>
          <span className="flex-shrink-0 mx-4 text-neutral-400 text-sm">hoặc đăng nhập với</span>
          <div className="flex-grow border-t border-neutral-200"></div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-200 font-medium text-neutral-700 active:bg-neutral-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-200 font-medium text-neutral-700 active:bg-neutral-50 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.8 1.98-.05 3.32.74 4.19 1.83-3.62 2.05-3.05 6.4.45 7.82-.87 2.15-2.18 4.23-3.3 5.32zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Apple
          </button>
        </div>

        <div className="mt-auto pt-8 flex justify-center pb-4">
          <span className="text-neutral-600 mr-1">Chưa có tài khoản?</span>
          <button onClick={() => navigate('/register')} type="button" className="text-orange-500 font-medium">Đăng ký</button>
        </div>
      </div>
    </div>
  );
}
