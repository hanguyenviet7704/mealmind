import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'MealMind — Gợi ý món ăn thông minh',
  description:
    'MealMind giúp bạn lên thực đơn hàng ngày, gợi ý món ăn phù hợp với sở thích và dinh dưỡng cho cả gia đình.',
  keywords: ['meal planning', 'recipe', 'nutrition', 'Vietnamese food', 'AI'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
