import React, { useState } from 'react';
import { ArrowLeft, UserPlus, ChevronRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

export function FamilyScreen() {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 safe-top relative">
      <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 active:bg-neutral-100 rounded-full">
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900">Gia đình</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-2">
          <p className="text-sm text-orange-800 font-medium">MealMind sẽ tính toán gợi ý khẩu phần và tránh món ăn có dị ứng dựa trên tất cả thành viên khi bạn chọn nấu ăn chung.</p>
        </div>

        {/* Profiles */}
        {[
          { name: 'Chị Lan', icon: '👩', role: 'Bạn (Chủ TK)', age: 'Người lớn', diet: 'Không dị ứng', main: true },
          { name: 'Con Bảo', icon: '👦', role: 'Thành viên', age: 'Trẻ em (<12)', diet: 'Dị ứng: Hải sản' },
          { name: 'Bé Na', icon: '👧', role: 'Thành viên', age: 'Trẻ nhỏ (<6)', diet: 'Nhạt, ít cay' },
        ].map((m, i) => (
          <div key={i} onClick={() => !m.main && setSheetOpen(true)} className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center justify-between active:bg-neutral-50 cursor-pointer shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-3xl border border-neutral-200">
                {m.icon}
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
                  {m.name} 
                  {m.main && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded uppercase tracking-wider">Chính</span>}
                </h3>
                <div className="text-xs text-neutral-500 mt-1">{m.age} · {m.diet}</div>
              </div>
            </div>
            {!m.main && <Settings size={20} className="text-neutral-300" />}
          </div>
        ))}

        <button 
          onClick={() => setSheetOpen(true)}
          className="w-full mt-4 p-4 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 flex flex-col items-center justify-center gap-2 text-orange-600 font-bold active:bg-orange-50 transition-colors"
        >
          <UserPlus size={24} />
          Thêm thành viên
        </button>
      </div>

      {/* Edit Sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/50" onClick={() => setSheetOpen(false)}></motion.div>
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{type:'spring', damping:25, stiffness:200}}
              className="bg-white rounded-t-3xl pb-safe relative z-10 max-h-[90%] flex flex-col"
            >
              <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-3 flex-shrink-0"></div>
              <div className="px-5 pb-3 border-b border-neutral-100 flex justify-between items-center flex-shrink-0">
                <h3 className="font-bold text-lg">Sửa thành viên</h3>
                <button onClick={() => setSheetOpen(false)} className="text-neutral-500 font-medium">Đóng</button>
              </div>
              
              <div className="overflow-y-auto p-5 space-y-6">
                <div>
                  <label className="text-sm font-bold text-neutral-700 block mb-2">Tên / Biệt danh</label>
                  <input type="text" defaultValue="Con Bảo" className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:orange-500 outline-none" />
                </div>
                
                <div>
                  <label className="text-sm font-bold text-neutral-700 block mb-2">Avatar</label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {['🧑','👦','👧','👶','👴','👵'].map(em => (
                      <button key={em} className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center border-2 ${em === '👦' ? 'border-orange-500 bg-orange-50' : 'border-neutral-200 bg-white'}`}>
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-neutral-700 block mb-2">Nhóm tuổi</label>
                  <div className="flex flex-wrap gap-2">
                    {['Trẻ < 6 tuổi', '6 - 12 tuổi', 'Teen', 'Người lớn', 'Người cao tuổi'].map(a => (
                      <button key={a} className={`px-4 py-2 border rounded-full text-sm font-medium ${a === '6 - 12 tuổi' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-neutral-200'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-neutral-700 block mb-2">Dị ứng</label>
                  <div className="flex flex-wrap gap-2">
                    {['Hải sản', 'Đậu phộng', 'Sữa'].map((a, i) => (
                      <button key={a} className={`px-4 py-2 border rounded-xl text-sm font-medium flex gap-2 ${i === 0 ? 'border-red-500 bg-red-50 text-red-700' : 'border-neutral-200'}`}>
                        {i === 0 && <Check size={16}/>} {a}
                      </button>
                    ))}
                    <button className="px-4 py-2 border border-dashed border-neutral-300 rounded-xl text-sm font-medium text-neutral-500">
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-neutral-100 flex-shrink-0 bg-white">
                <button className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl mb-3" onClick={() => setSheetOpen(false)}>Lưu thông tin</button>
                <button className="w-full text-red-500 font-bold py-2" onClick={() => setSheetOpen(false)}>Xóa thành viên này</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
