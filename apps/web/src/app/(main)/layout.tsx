import { TopNav } from '@/components/layout/TopNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <TopNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
