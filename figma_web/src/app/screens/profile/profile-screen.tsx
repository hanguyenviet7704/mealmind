import { Link } from 'react-router';
import { User, Settings, Heart, History, Award, ChevronRight, LogOut, Info, Bookmark, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { TopNav } from '../../components/ui/top-nav';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function ProfileScreen() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <TopNav />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <div className="w-full md:w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-stone-100">
            <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-md relative">
              <span className="text-3xl font-bold text-orange-600">L</span>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow border border-stone-200 flex items-center justify-center hover:text-orange-500 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-1">Lan Nguyễn</h2>
            <p className="text-stone-500 text-sm mb-4">lan.nguyen@example.com</p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              <Award className="w-4 h-4" /> Tài khoản Premium
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="p-4 bg-stone-50/50 border-b border-stone-100">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Quản lý tài khoản</h3>
            </div>
            <div className="flex flex-col">
              <Link to="/profile" className="flex items-center justify-between p-4 bg-orange-50/50 text-orange-600 border-l-4 border-orange-500 hover:bg-orange-50 transition-colors">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Thông tin cá nhân</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/profile/history" className="flex items-center justify-between p-4 text-stone-700 border-l-4 border-transparent hover:bg-stone-50 hover:text-orange-600 transition-colors">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5" />
                  <span className="font-medium">Lịch sử nấu ăn</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/recipes?saved=true" className="flex items-center justify-between p-4 text-stone-700 border-l-4 border-transparent hover:bg-stone-50 hover:text-orange-600 transition-colors">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Món ăn yêu thích</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/upgrade" className="flex items-center justify-between p-4 text-stone-700 border-l-4 border-transparent hover:bg-stone-50 hover:text-orange-600 transition-colors border-t border-stone-100">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Gói đăng ký</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
            <h1 className="text-2xl font-bold text-stone-900 mb-6">Thông tin cá nhân</h1>
            
            <form className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Họ và tên</label>
                  <input type="text" defaultValue="Lan Nguyễn" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Email</label>
                  <input type="email" defaultValue="lan.nguyen@example.com" disabled className="w-full bg-stone-100 border border-stone-200 rounded-lg px-4 py-2.5 text-stone-500 cursor-not-allowed" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Số điện thoại</label>
                <input type="tel" placeholder="Chưa cập nhật" className="w-full max-w-sm bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow" />
              </div>

              <div className="pt-6 border-t border-stone-100">
                <h3 className="text-lg font-bold text-stone-900 mb-4">Sở thích ẩm thực</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Vùng miền ưu tiên</label>
                    <select className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Miền Nam</option>
                      <option>Miền Bắc</option>
                      <option>Miền Trung</option>
                      <option>Không phân biệt</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Mục tiêu dinh dưỡng</label>
                    <select className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Giữ cân (2000 kcal/ngày)</option>
                      <option>Giảm cân (1500 kcal/ngày)</option>
                      <option>Tăng cân (2500 kcal/ngày)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <Button variant="outline" className="border-stone-200 text-stone-600">Hủy thay đổi</Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Lưu cập nhật</Button>
              </div>
            </form>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">45</div>
                <div className="text-sm text-stone-500">Món đã lưu</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <History className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">128</div>
                <div className="text-sm text-stone-500">Bữa đã nấu</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">12</div>
                <div className="text-sm text-stone-500">Huy hiệu đạt được</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}