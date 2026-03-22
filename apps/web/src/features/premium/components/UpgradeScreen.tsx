'use client';

import { useRouter } from 'next/navigation';
import { X, Check, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { feature: 'Gợi ý/ngày', free: '50', pro: '∞' },
  { feature: 'Thực đơn', free: '3', pro: '∞' },
  { feature: 'Profile gia đình', free: '6', pro: '10' },
  { feature: 'Surprise', free: '5/day', pro: '∞' },
  { feature: 'Export dữ liệu', free: false, pro: true },
  { feature: 'Tìm kiếm', free: 'cơ bản', pro: 'AI' },
  { feature: 'Dark mode', free: false, pro: true },
  { feature: 'Quảng cáo', free: 'có', pro: 'không' },
];

const testimonials = [
  { rating: 5, text: 'Tiết kiệm 2 tiếng mỗi tuần lên thực đơn!', author: 'Chị Hương, Hà Nội' },
  { rating: 5, text: 'Gia đình tôi ăn đa dạng hơn hẳn từ khi dùng Pro', author: 'Anh Tuấn, HCM' },
  { rating: 5, text: 'Rất hữu ích cho mẹ bỉm sữa bận rộn', author: 'Chị Lan, Đà Nẵng' },
];

export default function UpgradeScreen() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Close button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-stone-500" />
        </button>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-white text-center mb-8 shadow-lg">
        <Sparkles className="w-14 h-14 mx-auto mb-4 opacity-90" />
        <h1 className="text-4xl font-bold mb-3">MealMind Pro</h1>
        <p className="text-orange-100 text-lg mb-8">Trải nghiệm nấu ăn không giới hạn</p>
        <div className="space-y-1">
          <div className="text-5xl font-bold">79,000₫</div>
          <div className="text-orange-100 text-lg">/ tháng</div>
          <div className="text-sm text-orange-200 mt-2">hoặc 790,000₫ / năm <span className="bg-white/20 px-2 py-0.5 rounded-full ml-1">tiết kiệm 17%</span></div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-8">
        <div className="p-5 border-b border-stone-100">
          <h2 className="font-bold text-stone-800 text-center text-lg">So sánh tính năng</h2>
        </div>
        <div className="divide-y divide-stone-100">
          <div className="grid grid-cols-3 gap-4 p-4 bg-stone-50 font-semibold text-sm">
            <div className="text-stone-700">Tính năng</div>
            <div className="text-center text-stone-500">Free</div>
            <div className="text-center text-orange-600">Pro ⭐</div>
          </div>
          {features.map((item, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 p-4 items-center hover:bg-stone-50 transition-colors">
              <div className="text-sm text-stone-700 font-medium">{item.feature}</div>
              <div className="text-center text-sm">
                {typeof item.free === 'boolean' ? (
                  item.free ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-stone-300 mx-auto" />
                ) : (
                  <span className="text-stone-500">{item.free}</span>
                )}
              </div>
              <div className="text-center text-sm font-semibold">
                {typeof item.pro === 'boolean' ? (
                  item.pro ? <Check className="w-5 h-5 text-orange-600 mx-auto" /> : <X className="w-5 h-5 text-stone-300 mx-auto" />
                ) : (
                  <span className="text-orange-600">{item.pro}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-8">
        <h2 className="font-bold text-stone-800 mb-4 text-center text-lg">Đánh giá từ người dùng</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <div className="flex gap-0.5 mb-3">
                {[...Array(item.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">⭐</span>
                ))}
              </div>
              <p className="text-stone-700 mb-3 italic">&ldquo;{item.text}&rdquo;</p>
              <p className="text-sm text-stone-500 font-medium">— {item.author}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
        <Button className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg gap-2 shadow-md rounded-xl font-semibold">
          <Zap className="w-6 h-6" /> Dùng thử 7 ngày miễn phí
        </Button>
        <p className="text-xs text-stone-500 text-center mt-3">
          Hủy bất cứ lúc nào. Không bị tính phí nếu hủy trong 7 ngày.
        </p>
      </div>

      <div className="text-center">
        <button onClick={() => router.back()} className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
          Tiếp tục dùng Free →
        </button>
      </div>
    </div>
  );
}
