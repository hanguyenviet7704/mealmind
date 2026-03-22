import { Link, useLocation } from "react-router";
import { Home, BookOpen, CalendarDays, User } from "lucide-react";

export function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 safe-area-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-4xl mx-auto">
        <Link 
          to="/home" 
          className={`flex flex-col items-center gap-1 ${currentPath.startsWith('/home') ? 'text-orange-500' : 'text-stone-400'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link 
          to="/recipes" 
          className={`flex flex-col items-center gap-1 ${currentPath.startsWith('/recipes') ? 'text-orange-500' : 'text-stone-400'}`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xs">Món ăn</span>
        </Link>
        <Link 
          to="/meal-plan" 
          className={`flex flex-col items-center gap-1 ${currentPath.startsWith('/meal-plan') ? 'text-orange-500' : 'text-stone-400'}`}
        >
          <CalendarDays className="w-6 h-6" />
          <span className="text-xs">Thực đơn</span>
        </Link>
        <Link 
          to="/profile" 
          className={`flex flex-col items-center gap-1 ${currentPath.startsWith('/profile') ? 'text-orange-500' : 'text-stone-400'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Cá nhân</span>
        </Link>
      </div>
    </div>
  );
}
