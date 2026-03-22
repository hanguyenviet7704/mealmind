import { Wrench, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function MaintenanceScreen() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <Wrench className="w-24 h-24 text-orange-500" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-semibold text-stone-800 mb-4">
          Đang bảo trì hệ thống
        </h2>
        <p className="text-stone-600 mb-8">
          Chúng tôi đang nâng cấp để phục vụ bạn tốt hơn. Dự kiến hoàn thành lúc 14:00 hôm nay.
        </p>

        {/* Retry Button */}
        <Button 
          onClick={handleRetry}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2 mb-8"
        >
          <RefreshCw className="w-5 h-5" />
          Kiểm tra lại
        </Button>

        {/* Social Links */}
        <div className="pt-6 border-t border-stone-200">
          <p className="text-sm text-stone-600 mb-4">Theo dõi cập nhật:</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm">Facebook</Button>
            <Button variant="outline" size="sm">Zalo OA</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
