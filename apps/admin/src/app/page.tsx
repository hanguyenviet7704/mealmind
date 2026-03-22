import { Settings } from 'lucide-react';

export default function AdminHomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-8 h-8 text-primary-500" />
        <h1 className="text-3xl font-bold text-stone-900">MealMind Admin</h1>
      </div>
      <p className="text-stone-500">
        Dashboard quản trị — recipe management, moderation, analytics.
      </p>
    </main>
  );
}
