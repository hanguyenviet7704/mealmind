import { Link, useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Lock, Mail, Bell, Globe, Package, Trash2, FileText, Shield, Info } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function SettingsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-stone-800">Cài đặt</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Account Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase mb-3 px-2">Tài khoản</h2>
          <div className="bg-white rounded-lg overflow-hidden divide-y">
            <Link to="/settings/password" className="flex items-center justify-between p-4 hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-stone-600" />
                <span className="text-stone-800">Đổi mật khẩu</span>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </Link>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-stone-600" />
                <div>
                  <div className="text-stone-800">Email</div>
                  <div className="text-sm text-stone-500">lan@email.com (không đổi được)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase mb-3 px-2">Thông báo</h2>
          <div className="bg-white rounded-lg overflow-hidden">
            <Link to="/settings/notifications" className="flex items-center justify-between p-4 hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-stone-600" />
                <span className="text-stone-800">Cài đặt thông báo</span>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </Link>
          </div>
        </div>

        {/* Display */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase mb-3 px-2">Hiển thị</h2>
          <div className="bg-white rounded-lg overflow-hidden divide-y">
            <Link to="/settings/language" className="flex items-center justify-between p-4 hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-stone-600" />
                <span className="text-stone-800">Ngôn ngữ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500">Tiếng Việt</span>
                <ChevronRight className="w-5 h-5 text-stone-400" />
              </div>
            </Link>
          </div>
        </div>

        {/* Data */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase mb-3 px-2">Dữ liệu</h2>
          <div className="bg-white rounded-lg overflow-hidden divide-y">
            <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 text-left">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-stone-600" />
                <span className="text-stone-800">Xuất dữ liệu</span>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 text-left">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-stone-600" />
                <span className="text-stone-800">Xóa cache</span>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </button>
          </div>
        </div>

        {/* Other */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase mb-3 px-2">Khác</h2>
          <div className="bg-white rounded-lg overflow-hidden divide-y">
            <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 text-left">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-stone-600" />
                <span className="text-stone-800">Điều khoản sử dụng</span>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 text-left">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-stone-600" />
                <span className="text-stone-800">Chính sách riêng tư</span>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50 text-left">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-stone-600" />
                <div>
                  <div className="text-stone-800">Về MealMind</div>
                  <div className="text-xs text-stone-500">Version 1.0.0</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="text-center pt-6 pb-8">
          <Link to="/settings/delete-account" className="text-sm text-red-600 hover:text-red-700 underline">
            ⚠ Xóa tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}
