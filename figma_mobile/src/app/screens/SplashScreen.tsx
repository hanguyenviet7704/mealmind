import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChefHat } from 'lucide-react';
import { motion } from 'motion/react';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-orange-500 h-full w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="bg-white p-5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] mb-5">
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 6C15.1634 6 8 13.1634 8 22V26H40V22C40 13.1634 32.8366 6 24 6Z" fill="#F97316"/>
            <path d="M12 26H36V32C36 36.4183 32.4183 40 28 40H20C15.5817 40 12 36.4183 12 32V26Z" fill="#FDBA74"/>
            <path d="M24 10C24 10 21 14 21 18H27C27 14 24 10 24 10Z" fill="white"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">MealMind</h1>
      </motion.div>
    </div>
  );
}
