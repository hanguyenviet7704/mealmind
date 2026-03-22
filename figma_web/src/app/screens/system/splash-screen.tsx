import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { UtensilsCrossed } from 'lucide-react';
import { Progress } from '../../components/ui/progress';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Navigate after 2 seconds
    const timeout = setTimeout(() => {
      // Check auth status - for now, go to login
      const hasToken = localStorage.getItem('mealmind_token');
      const hasCompletedOnboarding = localStorage.getItem('mealmind_onboarding_completed');
      
      if (!hasToken) {
        navigate('/login');
      } else if (!hasCompletedOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/home');
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-500 to-orange-600">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <UtensilsCrossed className="w-16 h-16 text-orange-500" />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">MealMind</h1>
          <p className="text-white/80 text-lg">Gợi ý món ăn thông minh</p>
        </motion.div>

        <div className="w-64">
          <Progress value={progress} className="h-1 bg-white/30" />
        </div>
      </motion.div>
    </div>
  );
}
