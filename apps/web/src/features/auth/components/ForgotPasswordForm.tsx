'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Lock, Mail, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { forgotPasswordApi } from '@/features/auth/api/authApi';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setLoading(true);

    try {
      await forgotPasswordApi({ email });
      setSent(true);
      setCountdown(60);
      toast.success('Đã gửi link đặt lại mật khẩu');
    } catch (err: unknown) {
      // API always returns 200 for security, but handle errors
      setSent(true);
      setCountdown(60);
      toast.success('Đã gửi link đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  }, [email]);

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
        <div className="w-full max-w-md">
          <Link href="/login" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8">
            <ChevronLeft className="w-5 h-5" />
            <span>Đăng nhập</span>
          </Link>

          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-12 h-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-semibold text-stone-800 mb-3">Kiểm tra hộp thư!</h2>
            <p className="text-stone-600">
              Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Link có hiệu lực trong 1 giờ.
            </p>
          </div>

          <Button
            onClick={() => countdown <= 0 && handleSubmit()}
            variant="outline"
            className="w-full h-12 mb-3"
            disabled={countdown > 0}
          >
            {countdown > 0 ? `Gửi lại sau: ${countdown} giây` : 'Gửi lại email'}
          </Button>

          <Link href="/login" className="block text-center">
            <Button variant="ghost" className="w-full h-12">
              <ChevronLeft className="w-5 h-5 mr-2" />
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
      <div className="w-full max-w-md">
        <Link href="/login" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8">
          <ChevronLeft className="w-5 h-5" />
          <span>Đăng nhập</span>
        </Link>

        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-semibold text-stone-800 mb-3">Quên mật khẩu?</h2>
          <p className="text-stone-600">Nhập email để nhận link đặt lại mật khẩu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi link đặt lại'}
          </Button>

          <div className="text-center pt-4">
            <span className="text-sm text-stone-600">Nhớ mật khẩu? </span>
            <Link href="/login" className="text-sm text-orange-600 hover:text-orange-700 font-medium">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
