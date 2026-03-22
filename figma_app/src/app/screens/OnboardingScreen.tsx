import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else navigate('/home');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white safe-top safe-bottom">
      {/* Progress Bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex gap-1 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className={`flex-1 h-full transition-colors duration-300 ${i <= step ? 'bg-orange-500' : 'bg-transparent'}`} />
          ))}
        </div>
        <div className="text-right text-xs font-bold text-neutral-400 mt-2">{step}/5</div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 px-6 py-4 flex flex-col"
          >
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 />}
            {step === 5 && <Step5 />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="px-6 py-4 bg-white border-t border-neutral-100 flex justify-between items-center z-10">
        <button onClick={() => navigate('/home')} className="text-neutral-500 font-medium px-2 py-2">Bỏ qua</button>
        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 active:bg-neutral-50">
              <ChevronLeft size={24} />
            </button>
          )}
          <button onClick={handleNext} className="h-12 px-6 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center gap-2 active:bg-orange-600 shadow-sm shadow-orange-200">
            {step === 5 ? 'Hoàn thành' : 'Tiếp tục'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Step1() {
  const regions = [
    { id: 'mb', title: 'Miền Bắc', desc: 'Phở, bún chả, nem', icon: '🍜' },
    { id: 'mt', title: 'Miền Trung', desc: 'Bún bò, mì Quảng', icon: '🥘' },
    { id: 'mn', title: 'Miền Nam', desc: 'Cơm tấm, hủ tiếu', icon: '🍛' },
    { id: 'qt', title: 'Quốc tế', desc: 'Nhật, Hàn, Âu', icon: '🍣' }
  ];
  const [selected, setSelected] = useState<string[]>(['mb', 'mn']);

  return (
    <>
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Bạn thích ẩm thực vùng nào?</h2>
      <p className="text-neutral-500 mb-6">Chọn các món bạn thường ăn để gợi ý chuẩn hơn.</p>
      
      <div className="grid grid-cols-2 gap-4">
        {regions.map(r => {
          const isSel = selected.includes(r.id);
          return (
            <div 
              key={r.id}
              onClick={() => setSelected(prev => isSel ? prev.filter(x => x !== r.id) : [...prev, r.id])}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                isSel ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-neutral-100 bg-white shadow-sm'
              }`}
            >
              <div className="text-4xl mb-3">{r.icon}</div>
              <h3 className={`font-bold mb-1 ${isSel ? 'text-orange-700' : 'text-neutral-800'}`}>{r.title}</h3>
              <p className={`text-xs ${isSel ? 'text-orange-600/80' : 'text-neutral-500'}`}>{r.desc}</p>
              {isSel && <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white"><Check size={14}/></div>}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Step2() {
  return (
    <>
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Khẩu vị của bạn?</h2>
      <p className="text-neutral-500 mb-8">Điều chỉnh mức độ gia vị theo sở thích.</p>
      
      <div className="space-y-8">
        {[
          { icon: '🌶️', label: 'Cay', val: 3, emoji: '😊' },
          { icon: '🍬', label: 'Ngọt', val: 2, emoji: '🙂' },
          { icon: '🧂', label: 'Mặn', val: 4, emoji: '😅' },
        ].map(taste => (
          <div key={taste.label}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-neutral-800 flex items-center gap-2">{taste.icon} {taste.label}</span>
              <span className="text-2xl">{taste.emoji}</span>
            </div>
            <div className="relative w-full h-2 bg-neutral-200 rounded-full">
              <div className="absolute top-0 left-0 h-full bg-orange-500 rounded-full" style={{ width: `${(taste.val - 1) * 25}%` }}></div>
              <input type="range" min="1" max="5" defaultValue={taste.val} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-orange-500 rounded-full shadow-md pointer-events-none" style={{ left: `calc(${(taste.val - 1) * 25}% - 12px)` }}></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-neutral-400 mt-2 px-1">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Step3() {
  const allergens = [
    { icon: '🦐', label: 'Hải sản' }, { icon: '🐟', label: 'Cá' }, { icon: '🥜', label: 'Đậu phộng' },
    { icon: '🌾', label: 'Gluten' }, { icon: '🥛', label: 'Sữa' }, { icon: '🥚', label: 'Trứng' },
    { icon: '🫘', label: 'Đậu nành' }, { icon: '🌰', label: 'Hạt cây' }
  ];
  return (
    <>
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Dị ứng thực phẩm?</h2>
      <p className="text-neutral-500 mb-6">Bỏ qua nếu bạn không bị dị ứng gì.</p>
      
      <div className="flex flex-wrap gap-3 mb-8">
        {allergens.map(a => (
          <button key={a.label} className="px-4 py-3 rounded-xl border border-neutral-200 bg-white flex flex-col items-center gap-1 active:bg-neutral-50 w-[calc(33.33%-8px)]">
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs font-medium text-neutral-700">{a.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-auto">
        <label className="text-sm font-bold text-neutral-700 block mb-2">Thêm nguyên liệu khác:</label>
        <input type="text" placeholder="+ Thêm nguyên liệu..." className="w-full bg-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>
    </>
  );
}

function Step4() {
  const diets = [
    { id: 'bt', label: 'Bình thường', desc: 'Không giới hạn thực phẩm' },
    { id: 'chay', label: 'Chay (trứng+sữa)', desc: 'Không thịt cá. Có ăn trứng, sữa' },
    { id: 'vegan', label: 'Thuần chay (Vegan)', desc: 'Không dùng sản phẩm động vật' },
    { id: 'keto', label: 'Keto', desc: '< 20g carb/ngày' },
  ];
  return (
    <>
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">Chế độ ăn đặc biệt?</h2>
      
      <div className="space-y-3">
        {diets.map(d => (
          <label key={d.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${d.id === 'bt' ? 'border-orange-500 bg-orange-50' : 'border-neutral-100 bg-white'}`}>
            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${d.id === 'bt' ? 'border-orange-500' : 'border-neutral-300'}`}>
              {d.id === 'bt' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
            </div>
            <div>
              <h3 className={`font-bold ${d.id === 'bt' ? 'text-orange-900' : 'text-neutral-800'}`}>{d.label}</h3>
              <p className={`text-sm mt-0.5 ${d.id === 'bt' ? 'text-orange-700' : 'text-neutral-500'}`}>{d.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </>
  );
}

function Step5() {
  return (
    <>
      <h2 className="text-2xl font-bold text-neutral-900 mb-8">Thói quen nấu ăn?</h2>
      
      <div className="space-y-8">
        <div>
          <label className="text-sm font-bold text-neutral-700 block mb-3">Thời gian nấu tối đa mỗi bữa:</label>
          <div className="flex gap-2">
            {['<15p', '15-30p', '30-60p', '>60p'].map((t, i) => (
              <button key={t} className={`flex-1 py-3 rounded-xl border font-semibold text-sm ${i === 1 ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-neutral-200 bg-white text-neutral-600'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-neutral-700 block mb-3">Gia đình bạn có mấy người?</label>
          <div className="flex items-center gap-6 justify-center">
            <button className="w-12 h-12 rounded-full border-2 border-neutral-200 flex items-center justify-center text-xl font-bold text-neutral-500">-</button>
            <span className="text-3xl font-bold text-neutral-900 w-8 text-center">4</span>
            <button className="w-12 h-12 rounded-full border-2 border-orange-500 bg-orange-50 flex items-center justify-center text-xl font-bold text-orange-600">+</button>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-neutral-700 block mb-3">Trình độ nấu nướng:</label>
          <div className="flex gap-3">
            {[
              { label: 'Mới bắt đầu', icon: '🔰' },
              { label: 'Cơ bản', icon: '👨‍🍳', active: true },
              { label: 'Thành thạo', icon: '⭐' }
            ].map(lvl => (
              <button key={lvl.label} className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 ${lvl.active ? 'border-orange-500 bg-orange-50' : 'border-neutral-100 bg-white'}`}>
                <span className="text-2xl">{lvl.icon}</span>
                <span className={`text-xs font-bold ${lvl.active ? 'text-orange-700' : 'text-neutral-600'}`}>{lvl.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
