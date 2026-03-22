import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Heart, Share, Clock, Flame, Star, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export function RecipeDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'NL' | 'CACH_NAU' | 'DD'>('NL');
  const [servings, setServings] = useState(2);

  // Fake parallax
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.5]);

  return (
    <div className="flex-1 bg-white h-full overflow-y-auto relative">
      {/* Floating Header */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-between items-center p-4 safe-top pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto active:bg-black/50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white active:bg-black/50 transition-colors">
            <Heart size={20} />
          </button>
          <button className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white active:bg-black/50 transition-colors">
            <Share size={20} />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="h-[300px] w-full relative overflow-hidden -mt-safe-top">
        <motion.div style={{ y, opacity }} className="w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1631709497146-a239ef373cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBibyUyMHZpZXRuYW1lc2UlMjBub29kbGUlMjBzb3VwfGVufDF8fHx8MTc3NDA4MjQyNnww&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Phở bò" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative bg-white rounded-t-3xl -mt-6 p-5 min-h-[500px]">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Phở bò Hà Nội</h1>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-neutral-600">
          <span className="flex items-center gap-1 font-medium"><Clock size={16} className="text-neutral-400"/> 45p chuẩn bị + nấu</span>
          <span className="flex items-center gap-1 font-medium"><Flame size={16} className="text-neutral-400"/> 450kcal</span>
          <span className="flex items-center gap-1 font-medium"><Star size={16} className="text-yellow-400 fill-yellow-400"/> TB</span>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-semibold">Miền Bắc</span>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">Sáng</span>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">Tối</span>
        </div>

        <p className="text-neutral-600 text-sm mb-6 leading-relaxed">
          Phở bò truyền thống với nước dùng thanh ngọt hầm từ xương ống, kết hợp cùng các loại gia vị đặc trưng tạo nên hương vị khó quên.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 mb-6 sticky top-0 bg-white z-10 pt-2 pb-0">
          <button 
            className={`flex-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'NL' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-neutral-500'}`}
            onClick={() => setActiveTab('NL')}
          >
            Nguyên liệu
          </button>
          <button 
            className={`flex-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'CACH_NAU' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-neutral-500'}`}
            onClick={() => setActiveTab('CACH_NAU')}
          >
            Cách nấu
          </button>
          <button 
            className={`flex-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'DD' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-neutral-500'}`}
            onClick={() => setActiveTab('DD')}
          >
            Dinh dưỡng
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'NL' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 pb-20">
            <div className="flex items-center justify-between mb-6 p-4 bg-orange-50 rounded-2xl">
              <span className="font-semibold text-neutral-800">Số người ăn:</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-orange-200 flex items-center justify-center text-orange-600 active:bg-orange-100"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-bold w-4 text-center">{servings}</span>
                <button 
                  onClick={() => setServings(servings + 1)}
                  className="w-8 h-8 rounded-full bg-white border border-orange-200 flex items-center justify-center text-orange-600 active:bg-orange-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <span className="text-orange-500">▾</span> Nguyên liệu chính
              </h3>
              <ul className="space-y-3">
                {['Bánh phở', 'Thịt bò nạm', 'Xương ống'].map((item, i) => (
                  <li key={i} className="flex justify-between items-center cursor-pointer group">
                    <label className="flex items-center gap-3 cursor-pointer w-full py-1">
                      <input type="checkbox" className="w-5 h-5 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 accent-orange-500" />
                      <span className="text-neutral-700 font-medium">{item}</span>
                    </label>
                    <span className="text-neutral-500 border-b border-dotted border-neutral-300 flex-grow mx-4 mt-2"></span>
                    <span className="text-neutral-900 font-semibold">{[400, 200, 500][i] * (servings/2)}g</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <span className="text-orange-500">▾</span> Gia vị
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <label className="flex items-center gap-3 w-full py-1">
                    <input type="checkbox" className="w-5 h-5 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 accent-orange-500" />
                    <span className="text-neutral-700 font-medium">Nước mắm</span>
                  </label>
                  <span className="text-neutral-500 border-b border-dotted border-neutral-300 flex-grow mx-4 mt-2"></span>
                  <span className="text-neutral-900 font-semibold">{3 * (servings/2)} tbsp</span>
                </li>
                <li className="flex justify-between items-center">
                  <label className="flex items-center gap-3 w-full py-1">
                    <input type="checkbox" className="w-5 h-5 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 accent-orange-500" />
                    <span className="text-neutral-700 font-medium">Hoa hồi</span>
                  </label>
                  <span className="text-neutral-500 border-b border-dotted border-neutral-300 flex-grow mx-4 mt-2"></span>
                  <span className="text-neutral-900 font-semibold">{3 * (servings/2)} cái</span>
                </li>
              </ul>
            </div>
            
            <button 
              onClick={() => navigate('/recipes/1/cook')}
              className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl active:opacity-80 mt-4 flex items-center justify-center gap-2"
            >
              <Flame size={20} /> Bắt đầu nấu
            </button>
          </div>
        )}

        {activeTab === 'CACH_NAU' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 pb-20">
            {[
              { title: 'Rửa xương', desc: 'Rửa sạch xương bò, trần qua nước sôi 5 phút rồi rửa lại nước lạnh cho sạch bọt bẩn.' },
              { title: 'Hầm nước dùng', desc: 'Cho xương vào nồi, đổ ngập nước. Nướng thơm gừng, hành tây, hoa hồi, quế, thảo quả rồi cho vào nồi. Hầm nhỏ lửa trong 3-4 tiếng.', timer: '3 giờ' },
              { title: 'Chuẩn bị thịt', desc: 'Thịt bò nạm luộc chín mềm trong nồi nước dùng, vớt ra thái mỏng.' }
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0 z-10">
                    {i + 1}
                  </div>
                  {i < 2 && <div className="w-px h-full bg-neutral-200 mt-2"></div>}
                </div>
                <div className="pb-6">
                  <h4 className="font-bold text-neutral-900 mb-1">{step.title}</h4>
                  <p className="text-neutral-600 leading-relaxed mb-3">{step.desc}</p>
                  {step.timer && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium active:bg-blue-100">
                      <Clock size={16} /> Bấm giờ: {step.timer}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'DD' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 pb-20">
            <div onClick={() => navigate(`/recipes/${id}/nutrition`)} className="flex items-center justify-between mb-6 p-6 bg-neutral-50 rounded-2xl cursor-pointer active:bg-neutral-100">
              <div>
                <span className="block text-neutral-500 text-sm font-medium mb-1">Tổng năng lượng</span>
                <span className="text-3xl font-bold text-neutral-900 flex items-center gap-1">
                  <Flame className="text-orange-500" /> 450<span className="text-lg text-neutral-500 font-normal">kcal</span>
                </span>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-orange-400 flex items-center justify-center relative">
                 <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-l-transparent border-t-transparent rotate-45"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-green-400 border-r-transparent border-t-transparent -rotate-45"></div>
                 <span className="text-[10px] font-bold text-neutral-600">100%</span>
              </div>
            </div>

            <div className="space-y-5">
              {[
                { label: 'Protein (Đạm)', val: '35.2g', pct: '70%', color: 'bg-blue-500' },
                { label: 'Carbs (Tinh bột)', val: '42.8g', pct: '53%', color: 'bg-orange-500' },
                { label: 'Fat (Chất béo)', val: '15.3g', pct: '33%', color: 'bg-green-500' }
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-neutral-700">{m.label}</span>
                    <span className="text-neutral-900">{m.val}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                    <div className={`h-full ${m.color}`} style={{ width: m.pct }}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-neutral-400 mt-6 italic flex items-start gap-1">
              <span className="text-orange-500">⚠</span> Giá trị dinh dưỡng mang tính chất tham khảo cho 1 khẩu phần ăn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
