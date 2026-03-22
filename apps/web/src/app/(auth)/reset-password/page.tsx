import { Suspense } from 'react';
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';

export const metadata = { title: 'Đặt lại mật khẩu — MealMind' };

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
