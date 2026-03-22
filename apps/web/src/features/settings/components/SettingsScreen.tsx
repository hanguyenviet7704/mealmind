'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Bell, Shield, Palette, Globe, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const settingsSections = [
  { title: 'Thông báo', icon: Bell, description: 'Quản lý thông báo gợi ý món ăn' },
  { title: 'Bảo mật', icon: Shield, description: 'Đổi mật khẩu, xóa tài khoản' },
  { title: 'Giao diện', icon: Palette, description: 'Chế độ sáng / tối' },
  { title: 'Ngôn ngữ', icon: Globe, description: 'Tiếng Việt' },
  { title: 'Trợ giúp', icon: HelpCircle, description: 'FAQ, liên hệ hỗ trợ' },
];

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-6">
        <ChevronLeft className="w-5 h-5" /><span className="font-medium">Quay lại</span>
      </button>

      <h1 className="text-2xl font-bold text-stone-900 mb-6">Cài đặt</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        {settingsSections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <button key={idx} className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0 text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-600"><Icon className="w-5 h-5" /></div>
                <div>
                  <div className="font-medium text-stone-800">{section.title}</div>
                  <div className="text-sm text-stone-500">{section.description}</div>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-stone-400 rotate-180" />
            </button>
          );
        })}
      </div>

      <div className="text-center mt-8 text-sm text-stone-400">
        <p>MealMind v0.1.0</p>
        <p className="mt-1">© 2024 MealMind. Made with ❤️ in Vietnam</p>
      </div>
    </div>
  );
}
