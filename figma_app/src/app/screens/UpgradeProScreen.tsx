import React, { useState } from 'react';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { useNavigate } from 'react-router';

export function UpgradeProScreen() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<'month' | 'year'>('year');

  const features = [
    'Không giới hạn gợi ý món ăn mỗi ngày',
    'Theo dõi dinh dưỡng chi tiết (Macro & Micro)',
    'Bộ lọc chế độ ăn nâng cao (Keto, Vegan...)',
    'Tạo đến 10 profile gia đình (Thay vì 3)',
    'Hoàn toàn không có quảng cáo',
    'Xuất PDF danh sách mua sắm & thực đơn'
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-900 safe-top text-white">
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-white/10 rounded-full">
          <ArrowLeft size={24} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-6 pt-2 pb-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(245,158,11,0.4)]">
            <Star size={48} className="text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">MealMind Pro</h1>
          <p className="text-neutral-400 leading-relaxed max-w-[280px]">
            Nâng tầm trải nghiệm nấu ăn với các tính năng cao cấp nhất.
          </p>
        </div>

        <div className="px-6 space-y-4 mb-10">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-green-400" />
              </div>
              <span className="text-neutral-200 font-medium">{f}</span>
            </div>
          ))}
        </div>

        <div className="px-6 space-y-3">
          {/* Month Plan */}
          <div 
            onClick={() => setPlan('month')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${
              plan === 'month' ? 'border-orange-500 bg-orange-500/10' : 'border-neutral-800 bg-neutral-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${plan === 'month' ? 'border-orange-500' : 'border-neutral-600'}`}>
                {plan === 'month' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
              </div>
              <span className="font-bold text-lg">1 Tháng</span>
            </div>
            <span className="font-bold text-lg">79,000đ</span>
          </div>

          {/* Year Plan */}
          <div 
            onClick={() => setPlan('year')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center relative ${
              plan === 'year' ? 'border-orange-500 bg-orange-500/10' : 'border-neutral-800 bg-neutral-800/50'
            }`}
          >
            <div className="absolute -top-3 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-xs font-bold px-2 py-1 rounded-full">
              Tiết kiệm 37%
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${plan === 'year' ? 'border-orange-500' : 'border-neutral-600'}`}>
                {plan === 'year' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
              </div>
              <div>
                <div className="font-bold text-lg">1 Năm</div>
                <div className="text-sm text-neutral-400">49,000đ/tháng</div>
              </div>
            </div>
            <span className="font-bold text-lg">590,000đ</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-neutral-900 via-neutral-900 pb-safe z-10">
        <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg rounded-2xl active:opacity-90 shadow-lg shadow-orange-500/20 mb-4">
          ⭐ Đăng ký Pro
        </button>
        <div className="text-center space-y-2">
          <button className="text-sm font-bold text-neutral-400">Khôi phục giao dịch</button>
          <p className="text-[10px] text-neutral-600">Tự động gia hạn. Hủy bất kỳ lúc nào trong cài đặt App Store/Google Play.</p>
        </div>
      </div>
    </div>
  );
}
