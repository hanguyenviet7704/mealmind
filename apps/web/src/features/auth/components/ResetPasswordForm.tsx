'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { resetPasswordApi } from '@/features/auth/api/authApi';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getPasswordStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s += 25;
    if (pw.length >= 12) s += 25;
    if (/[A-Z]/.test(pw)) s += 25;
    if (/[0-9]/.test(pw)) s += 25;
    if (/[^A-Za-z0-9]/.test(pw)) s += 25;
    return Math.min(s, 100);
  };

  const getStrengthLabel = (s: number) => {
    if (s < 50) return { label: 'Yếu', color: 'bg-red-600' };
    if (s < 75) return { label: 'Trung bình', color: 'bg-yellow-600' };
    return { label: 'Mạnh', color: 'bg-green-600' };
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = getStrengthLabel(passwordStrength);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠</span>
          </div>
          <h2 className="text-2xl font-semibold text-stone-800 mb-4">
            Link đã hết hạn hoặc không hợp lệ
          </h2>
          <p className="text-stone-600 mb-8">
            Link đặt lại mật khẩu chỉ có hiệu lực trong 1 giờ và dùng được 1 lần.
          </p>
          <Button
            onClick={() => router.push('/forgot-password')}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Gửi lại link mới
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-stone-800 mb-4">
            Đặt lại mật khẩu thành công!
          </h2>
          <p className="text-stone-600 mb-8">
            Bạn đã bị đăng xuất khỏi tất cả thiết bị. Đăng nhập lại với mật khẩu mới.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }
    if (password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setLoading(true);

    try {
      await resetPasswordApi({ token, newPassword: password });
      setSuccess(true);
      toast.success('Đặt lại mật khẩu thành công!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Token không hợp lệ hoặc đã hết hạn';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-semibold text-stone-800 mb-3">Đặt mật khẩu mới</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Mật khẩu mới</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {password && (
              <div className="mt-2 flex items-center gap-2 mb-1">
                <Progress value={passwordStrength} className={`flex-1 h-1.5 ${strengthInfo.color}`} />
                <span className="text-xs text-stone-600">{strengthInfo.label}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 h-11"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </Button>
        </form>
      </div>
    </div>
  );
}
