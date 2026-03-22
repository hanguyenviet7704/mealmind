'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, BookOpen, Calendar, Clock, Settings, ChevronRight, LogOut, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/authStore';
import { logoutApi } from '@/features/auth/api/authApi';
import { toast } from 'sonner';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

interface ProfileStats { bookmarkCount: number; historyCount: number; }

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<ProfileStats>({ bookmarkCount: 0, historyCount: 0 });

  useEffect(() => {
    // Fetch bookmark count from API
    apiClient<{ id: string }[]>('/recipes/bookmarks?pageSize=1')
      .then(() => {
        // The response for paginated is just array, we need to count via a separate call
        // For now fetch all bookmarks to count
        apiClient<{ id: string }[]>('/recipes/bookmarks?pageSize=100')
          .then((res) => {
            const list = Array.isArray(res) ? res : [];
            setStats((s) => ({ ...s, bookmarkCount: list.length }));
          })
          .catch(() => { });
      })
      .catch(() => { });
  }, []);

  const handleLogout = async () => {
    try { await logoutApi(); } catch { }
    logout();
    toast.success('Đã đăng xuất');
    router.push('/login');
  };

  const menuItems = [
    { icon: BookOpen, label: 'Món ăn đã lưu', href: '/profile/bookmarks', count: stats.bookmarkCount || null },
    { icon: Calendar, label: 'Thực đơn tuần', href: '/meal-plan', count: null },
    { icon: Clock, label: 'Lịch sử nấu ăn', href: '/profile/history', count: null },
    { icon: Crown, label: 'Nâng cấp Pro', href: '/upgrade', count: null },
    { icon: Settings, label: 'Cài đặt', href: '/settings', count: null },
  ];

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 mb-6 text-center">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-orange-700">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <h1 className="text-2xl font-bold text-stone-900">{user?.name || 'Người dùng'}</h1>
        <p className="text-stone-500 mt-1">{user?.email || ''}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-orange-700 text-sm font-medium border border-orange-100">
          {user?.tier === 'pro' ? <><Crown className="w-4 h-4" /> Pro</> : 'Free'}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} href={item.href} className="flex items-center justify-between p-5 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-600"><Icon className="w-5 h-5" /></div>
                <span className="font-medium text-stone-800">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {item.count !== null && item.count > 0 && <span className="text-sm text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">{item.count}</span>}
                <ChevronRight className="w-5 h-5 text-stone-400" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <Button onClick={handleLogout} variant="outline" className="w-full mt-6 h-12 text-red-600 border-red-200 hover:bg-red-50 gap-2">
        <LogOut className="w-5 h-5" /> Đăng xuất
      </Button>
    </div>
  );
}
