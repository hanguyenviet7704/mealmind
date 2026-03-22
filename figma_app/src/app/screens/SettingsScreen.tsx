import React from 'react';
import { ArrowLeft, ChevronRight, Lock, Bell, Globe, FileText, ShieldAlert, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export function SettingsScreen() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Tài khoản',
      items: [
        { icon: <Lock size={20} />, label: 'Đổi mật khẩu', nav: true },
        { icon: <span className="w-5 text-center text-sm font-bold">@</span>, label: 'lan@email.com', value: 'Đã xác minh' },
        { icon: <span className="w-5 text-center">G</span>, label: 'Google', value: 'Đã liên kết', highlight: true },
        { icon: <span className="w-5 text-center">🍎</span>, label: 'Apple', value: 'Chưa liên kết' },
      ]
    },
    {
      title: 'Thông báo',
      items: [
        { icon: <Bell size={20} />, label: 'Push Notifications', toggle: true, checked: true },
        { icon: <span className="text-xl">🍳</span>, label: 'Gợi ý bữa sáng (07:00)', toggle: true, checked: true },
        { icon: <span className="text-xl">📅</span>, label: 'Nhắc tạo thực đơn', toggle: true, checked: true },
      ]
    },
    {
      title: 'Ứng dụng',
      items: [
        { icon: <Globe size={20} />, label: 'Ngôn ngữ', value: 'Tiếng Việt', nav: true },
        { icon: <FileText size={20} />, label: 'Điều khoản dịch vụ', nav: true },
        { icon: <ShieldAlert size={20} />, label: 'Chính sách bảo mật', nav: true },
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top">
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
          <ArrowLeft size={24} className="text-neutral-700" />
        </button>
        <h1 className="text-lg font-bold text-neutral-900">Cài đặt</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-12">
        {sections.map((sec, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">{sec.title}</h2>
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100">
              {sec.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 active:bg-neutral-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="text-neutral-500">{item.icon}</div>
                    <span className="font-medium text-neutral-900">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && (
                      <span className={`text-sm ${item.highlight ? 'text-green-600 font-bold' : 'text-neutral-400'}`}>
                        {item.value}
                      </span>
                    )}
                    {item.nav && <ChevronRight size={18} className="text-neutral-300" />}
                    {item.toggle && (
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${item.checked ? 'bg-orange-500' : 'bg-neutral-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${item.checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mb-6">
          <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2 ml-1">Nguy hiểm</h2>
          <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
             <div className="flex items-center justify-between p-4 active:bg-red-50 cursor-pointer text-red-600">
                <div className="flex items-center gap-3">
                  <Trash2 size={20} />
                  <span className="font-bold">Xóa tài khoản</span>
                </div>
                <ChevronRight size={18} className="text-red-300" />
             </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm font-bold text-neutral-900">MealMind v1.0.0</p>
          <p className="text-xs text-neutral-400 mt-1">© 2026 MealMind. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
