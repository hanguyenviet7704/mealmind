import { useNavigate } from 'react-router';
import { X, Check, Sparkles, Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';

const features = [
  { feature: 'Gợi ý/ngày', free: '50', pro: '∞' },
  { feature: 'Thực đơn', free: '3', pro: '∞' },
  { feature: 'Profile GĐ', free: '6', pro: '10' },
  { feature: 'Surprise', free: '5/day', pro: '∞' },
  { feature: 'Export data', free: false, pro: true },
  { feature: 'Tìm kiếm', free: 'cơ bản', pro: 'AI' },
  { feature: 'Dark mode', free: false, pro: true },
  { feature: 'Ads', free: 'có', pro: 'không' },
];

const testimonials = [
  {
    rating: 5,
    text: 'Tiết kiệm 2 tiếng mỗi tuần lên thực đơn!',
    author: 'Chị Hương, Hà Nội',
  },
  {
    rating: 5,
    text: 'Gia đình tôi ăn đa dạng hơn hẳn từ khi dùng Pro',
    author: 'Anh Tuấn, HCM',
  },
];

export default function UpgradeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-stone-800">Nâng cấp Pro</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center mb-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">MealMind Pro</h2>
          <p className="text-orange-100 mb-6">Trải nghiệm không giới hạn</p>
          <div className="space-y-2">
            <div className="text-4xl font-bold">79,000₫</div>
            <div className="text-orange-100">/ tháng</div>
            <div className="text-sm text-orange-200">hoặc 790,000₫ / năm (tiết kiệm 17%)</div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-stone-200">
            <h3 className="font-semibold text-stone-800 text-center">So sánh tính năng</h3>
          </div>
          <div className="divide-y divide-stone-200">
            <div className="grid grid-cols-3 gap-4 p-4 bg-stone-50 font-semibold text-sm">
              <div>Tính năng</div>
              <div className="text-center">Free</div>
              <div className="text-center">Pro</div>
            </div>
            {features.map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 p-4 items-center">
                <div className="text-sm text-stone-700">{item.feature}</div>
                <div className="text-center text-sm">
                  {typeof item.free === 'boolean' ? (
                    item.free ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />
                  ) : (
                    <span className="text-stone-600">{item.free}</span>
                  )}
                </div>
                <div className="text-center text-sm font-semibold">
                  {typeof item.pro === 'boolean' ? (
                    item.pro ? <Check className="w-4 h-4 text-orange-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />
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
          <h3 className="font-semibold text-stone-800 mb-4 text-center">Đánh giá từ người dùng</h3>
          <div className="space-y-4">
            {testimonials.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-stone-700 mb-2">"{item.text}"</p>
                <p className="text-sm text-stone-500">— {item.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <Button className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white text-lg gap-2 shadow-lg">
            <Zap className="w-6 h-6" />
            Dùng thử 7 ngày miễn phí
          </Button>
          <p className="text-xs text-stone-500 text-center mt-3">
            Hủy bất cứ lúc nào. Không bị tính phí nếu hủy trong 7 ngày.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            Tiếp tục dùng Free
          </button>
        </div>
      </div>
    </div>
  );
}
