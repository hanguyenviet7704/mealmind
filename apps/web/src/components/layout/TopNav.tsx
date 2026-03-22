'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, CalendarDays, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/authStore';

const navItems = [
  { icon: Home, label: 'Khám phá', path: '/home' },
  { icon: BookOpen, label: 'Món ăn', path: '/recipes' },
  { icon: CalendarDays, label: 'Thực đơn', path: '/meal-plan' },
];

export function TopNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="text-xl font-bold text-stone-900">MealMind</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-orange-600 border-b-2 border-orange-500'
                      : 'text-stone-600 hover:text-orange-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-stone-600">
              <Search className="w-5 h-5" />
            </Button>
            <Link href="/profile">
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold cursor-pointer border-2 border-transparent hover:border-orange-500 transition-colors">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
