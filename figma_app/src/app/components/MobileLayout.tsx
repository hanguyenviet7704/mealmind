import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Home, BookOpen, CalendarDays, User } from 'lucide-react';

export function MobileLayout() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-neutral-200 p-0 sm:p-4">
      <div className="w-full h-full max-w-[430px] sm:max-h-[932px] bg-white sm:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col border-[8px] border-neutral-900 ring-1 ring-neutral-300">
        {/* Dynamic content area */}
        <div className="flex-1 overflow-hidden relative bg-white">
          <Outlet />
        </div>
        
        {/* Bottom Tab Bar */}
        <BottomTabBar />
      </div>
    </div>
  );
}

function BottomTabBar() {
  const location = useLocation();
  
  // Hide tab bar on auth screens or specific details if needed
  const hideTabsPaths = [
    '/login', '/register', '/forgot-password', '/reset-password', '/splash', '/onboarding',
    '/search', '/surprise', '/upgrade', '/settings', '/quick-cook', '/combo', '/history', '/notifications'
  ];

  if (hideTabsPaths.some(p => location.pathname.startsWith(p)) || location.pathname.includes('/cook')) {
    return null;
  }

  const tabs = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/recipes', icon: BookOpen, label: 'Món ăn' },
    { path: '/plan', icon: CalendarDays, label: 'Thực đơn' },
    { path: '/profile', icon: User, label: 'Cá nhân' }
  ];

  return (
    <div className="h-16 bg-white border-t border-neutral-100 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        const Icon = tab.icon;
        
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className="flex flex-col items-center justify-center w-full h-full gap-1 p-1"
          >
            <Icon 
              size={24} 
              className={isActive ? 'text-orange-500 fill-orange-100' : 'text-neutral-400'} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`text-[10px] font-medium ${isActive ? 'text-orange-500' : 'text-neutral-500'}`}>
              {tab.label}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
}
