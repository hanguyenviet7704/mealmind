import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Không tìm thấy — MealMind' };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-8xl mb-6">🍜</div>
      <h1 className="text-3xl font-bold text-stone-900 mb-4">Trang không tìm thấy</h1>
      <p className="text-stone-600 mb-8 max-w-md">
        Món ăn bạn tìm có vẻ đã hết rồi. Hãy quay lại trang chủ để khám phá thêm nhé!
      </p>
      <Link href="/home">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8">
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
}
