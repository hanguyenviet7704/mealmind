import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

export function CookingModeScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(2); // Start at step 2 to show timer
  const [timeLeft, setTimeLeft] = useState(180); // 3 mins
  const [timerActive, setTimerActive] = useState(false);

  const totalSteps = 8;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // Haptic/sound simulation here
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-900 text-white safe-top safe-bottom">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-white/10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 active:text-white">
          <X size={24} /> Thoát
        </button>
        <div className="font-bold tracking-widest text-orange-500">
          BƯỚC {step}/{totalSteps}
        </div>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/10">
        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${(step/totalSteps)*100}%` }}></div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="h-full flex flex-col p-6"
          >
            <div className="w-full aspect-video rounded-3xl overflow-hidden bg-neutral-800 mb-8 shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1760445529233-ff4bd543270e?w=800&fit=crop" 
                alt="Cooking Step" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl"></div>
            </div>

            <p className="text-2xl font-medium leading-relaxed text-white/90">
              Cho thịt vào chảo đã nóng dầu, đảo đều trên lửa lớn trong 3 phút cho thịt chín se mặt ngoài và tỏa mùi thơm.
            </p>

            <div className="mt-auto pt-8">
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col items-center relative overflow-hidden">
                {/* Timer BG Progress */}
                {timerActive && (
                   <div 
                     className="absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-1000 ease-linear" 
                     style={{ width: `${(1 - timeLeft/180) * 100}%` }}
                   />
                )}
                
                <div className={`font-mono text-6xl font-light tracking-tighter mb-6 transition-colors ${timeLeft === 0 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </div>
                
                {timeLeft === 0 ? (
                  <button onClick={() => setTimeLeft(180)} className="w-full py-4 rounded-2xl bg-white text-black font-bold text-lg active:scale-95 transition-transform">
                    ✅ Đã xong (Lặp lại)
                  </button>
                ) : (
                  <button 
                    onClick={() => setTimerActive(!timerActive)}
                    className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform ${
                      timerActive ? 'bg-white/20 text-white' : 'bg-orange-500 text-white'
                    }`}
                  >
                    {timerActive ? <><Pause size={24}/> Tạm dừng</> : <><Play size={24}/> Bắt đầu timer</>}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="p-6 flex justify-between gap-4">
        <button 
          onClick={prevStep}
          disabled={step === 1}
          className="flex-1 py-4 rounded-2xl bg-white/10 font-bold text-white disabled:opacity-30 active:bg-white/20 transition-colors flex items-center justify-center gap-2"
        >
          <ChevronLeft size={24}/> Trước
        </button>
        <button 
          onClick={nextStep}
          disabled={step === totalSteps}
          className="flex-1 py-4 rounded-2xl bg-white font-bold text-black disabled:opacity-30 active:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
        >
          Tiếp <ChevronRight size={24}/>
        </button>
      </div>
    </div>
  );
}
