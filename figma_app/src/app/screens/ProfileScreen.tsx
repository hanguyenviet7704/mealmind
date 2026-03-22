import React from 'react';
import { ChevronRight, Heart, Star, LogOut, Settings, Bell, Shield, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ProfileScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      <div className="px-5 py-4 bg-white border-b border-neutral-100 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-neutral-900">Cá nhân</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/history')} className="p-2 bg-neutral-50 rounded-full text-neutral-600">
            <Activity size={20} />
          </button>
          <button onClick={() => navigate('/notifications')} className="p-2 bg-neutral-50 rounded-full text-neutral-600 relative">
            <Bell size={20} />
            <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profile Card */}
        <div className="bg-white p-5 mb-2">
          <div className="flex items-center gap-4">
            <div onClick={() => navigate('/profile/edit')} className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-100 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDAyODc3M3ww&ixlib=rb-4.1.0&q=80&w=1080" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/profile/edit')}>
                Chị Lan <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[10px] uppercase tracking-wider font-bold">Free</span>
              </h2>
              <p className="text-neutral-500 text-sm mt-0.5">lan@email.com</p>
            </div>
          </div>
          
          {/* Family Profiles */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-orange-600 text-lg relative z-30">
                👩 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 text-lg -ml-3 z-20">👦</div>
              <div className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-pink-600 text-lg -ml-3 z-10">👧</div>
              <div className="w-10 h-10 rounded-full bg-neutral-100 border-2 border-neutral-300 border-dashed flex items-center justify-center text-neutral-400 text-sm -ml-3 z-0">
                +
              </div>
            </div>
            <button onClick={() => navigate('/profile/family')} className="text-sm font-medium text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg active:bg-orange-100">
              Quản lý
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-4 space-y-3">
          {[
            { icon: <span className="text-xl">🍜</span>, title: 'Khẩu vị & Dị ứng', desc: 'Bắc, Nam · Không dị ứng', path: '/profile/dietary' },
            { icon: <Activity size={20} className="text-blue-500" />, title: 'Mục tiêu dinh dưỡng', desc: '2,000kcal · 120g Đạm', path: '/profile/goals' },
            { icon: <Heart size={20} className="text-red-500" />, title: 'Món yêu thích', desc: '12 món', path: '/history' }
          ].map((item, i) => (
            <div key={i} onClick={() => navigate(item.path)} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-neutral-100 active:bg-neutral-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">{item.title}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-neutral-300" />
            </div>
          ))}

          {/* Premium Banner */}
          <div 
            onClick={() => navigate('/upgrade')}
            className="mt-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 text-white shadow-md active:opacity-90 transition-opacity cursor-pointer relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-20"><Star size={100} /></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-1"><Star size={18} className="fill-white"/> Nâng cấp Pro</h3>
                <p className="text-orange-100 text-sm mt-1">Mở khóa tính năng dinh dưỡng, thực đơn</p>
              </div>
              <ChevronRight size={20} className="text-white/80" />
            </div>
          </div>

          <div className="mt-8 space-y-1">
             <button 
               onClick={() => navigate('/settings')}
               className="w-full flex items-center gap-3 py-3 text-neutral-700 font-medium active:bg-neutral-100 rounded-xl px-2 transition-colors"
             >
               <Settings size={20} className="text-neutral-400" /> Cài đặt ứng dụng
             </button>
             <button 
               onClick={() => navigate('/login')}
               className="w-full flex items-center gap-3 py-3 text-red-500 font-medium active:bg-red-50 rounded-xl px-2 transition-colors"
             >
               <LogOut size={20} /> Đăng xuất
             </button>
          </div>
          
          <div className="text-center mt-6 mb-4">
             <span className="text-xs text-neutral-400">MealMind v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
