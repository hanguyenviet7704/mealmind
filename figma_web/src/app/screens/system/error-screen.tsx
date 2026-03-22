import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router';

export default function ErrorScreen() {
  const navigate = useNavigate();
  const errorId = `ERR-${Math.random().toString(36).substr(2, 9)}`;

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  const copyErrorId = () => {
    navigator.clipboard.writeText(errorId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-24 h-24 text-orange-500" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-semibold text-stone-800 mb-4">
          Đã xảy ra lỗi
        </h2>
        <p className="text-stone-600 mb-8">
          Ứng dụng gặp sự cố. Vui lòng thử lại hoặc liên hệ hỗ trợ.
        </p>

        {/* Actions */}
        <div className="space-y-3 mb-8">
          <Button 
            onClick={handleRetry}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Thử lại
          </Button>
          <Button 
            onClick={handleGoHome}
            variant="outline"
            className="w-full gap-2"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Button>
        </div>

        {/* Error ID */}
        <div className="pt-6 border-t border-stone-200">
          <button
            onClick={copyErrorId}
            className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            Error ID: {errorId}
          </button>
        </div>
      </div>
    </div>
  );
}
