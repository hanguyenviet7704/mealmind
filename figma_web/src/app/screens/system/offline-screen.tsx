import { CloudOff, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function OfflineScreen() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
      <div className="w-full max-w-md">
        {/* Banner */}
        <div className="mb-8 bg-yellow-100 border border-yellow-600 rounded-lg p-4 flex items-center gap-3">
          <span className="text-yellow-800">⚠</span>
          <span className="text-yellow-800 font-medium">Mất kết nối mạng</span>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <CloudOff className="w-48 h-48 text-stone-300" />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-stone-800 mb-3">
            Không có kết nối mạng
          </h2>
          <p className="text-stone-600">
            Kiểm tra Wi-Fi hoặc dữ liệu di động
          </p>
        </div>

        {/* Retry Button */}
        <Button 
          onClick={handleRetry}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Thử lại
        </Button>

        {/* Offline Content */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <h3 className="font-semibold text-stone-800 mb-4">Nội dung đã lưu:</h3>
          <ul className="space-y-2 text-stone-600">
            <li>• Bookmarks (offline)</li>
            <li>• Lịch sử nấu ăn</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
