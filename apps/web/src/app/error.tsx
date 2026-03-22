'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-8xl mb-6">😥</div>
      <h1 className="text-3xl font-bold text-stone-900 mb-4">Có lỗi xảy ra</h1>
      <p className="text-stone-600 mb-8 max-w-md">
        Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại hoặc quay lại trang chủ.
      </p>
      <Button onClick={reset} className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8">
        Thử lại
      </Button>
    </div>
  );
}
