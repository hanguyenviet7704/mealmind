import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  X, ChevronLeft, ChevronRight, CheckCircle2, 
  Clock, Flame, ChefHat, PlayCircle, PauseCircle,
  Volume2, Maximize2, ListChecks, Check
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

// Mock data for a custom user-added recipe with YouTube link
const mockCustomRecipe = {
  id: 'custom',
  name: 'Bò Lúc Lắc Kiểu Pháp (Tự thêm)',
  imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
  isCustom: true,
  sourceUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Dummy
  cookTime: 30,
  ingredients: [
    { name: 'Thịt bò thăn', amount: '500g', checked: false },
    { name: 'Hành tây', amount: '1 củ', checked: false },
    { name: 'Ớt chuông (xanh, đỏ)', amount: '2 quả', checked: false },
    { name: 'Tỏi băm', amount: '2 muỗng', checked: false },
    { name: 'Bơ nhạt', amount: '30g', checked: false },
    { name: 'Gia vị: Xì dầu, dầu hào, tiêu', amount: 'Vừa đủ', checked: false },
  ],
  steps: [
    {
      number: 1,
      title: 'Sơ chế thịt bò',
      description: 'Cắt thịt bò thành các khối vuông nhỏ khoảng 2-3cm. Ướp với 1 muỗng xì dầu, 1 muỗng dầu hào, tỏi băm và một ít tiêu trong 15 phút.',
      duration: 15,
    },
    {
      number: 2,
      title: 'Sơ chế rau củ',
      description: 'Hành tây và ớt chuông rửa sạch, cắt khúc vuông tương tự kích thước thịt bò.',
      duration: null,
    },
    {
      number: 3,
      title: 'Xào rau củ',
      description: 'Bắc chảo nóng, cho một ít dầu ăn, xào nhanh hành tây và ớt chuông cho vừa chín tới. Đổ ra đĩa để riêng.',
      duration: 5,
    },
    {
      number: 4,
      title: 'Lắc bò',
      description: 'Tiếp tục dùng chảo đó, bật lửa lớn nhất, cho bơ vào. Khi bơ tan chảy, cho thịt bò vào áp chảo (lắc chảo) thật nhanh cho xém cạnh (khoảng 3-4 phút).',
      duration: 4,
    },
    {
      number: 5,
      title: 'Hoàn thành',
      description: 'Trút phần rau củ vào đảo đều cùng thịt bò thêm 1 phút. Tắt bếp và trút ra đĩa. Ăn nóng kèm bánh mì hoặc khoai tây chiên.',
      duration: 1,
    }
  ],
  notes: 'Có thể thay thế bơ bằng dầu ô liu nếu muốn giảm béo. Quan trọng nhất là lửa phải thật lớn ở bước 4.'
};

export default function CookingModeScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const recipe = mockCustomRecipe; // We use mock custom recipe for this demo
  
  const [currentStep, setCurrentStep] = useState(0);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [activeTab, setActiveTab] = useState<'steps' | 'ingredients' | 'notes'>('steps');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      // Play sound or alert here in real app
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Set initial timer when step changes
  useEffect(() => {
    if (recipe.steps[currentStep]?.duration) {
      setTimeLeft(recipe.steps[currentStep].duration! * 60);
      setIsTimerRunning(false);
    } else {
      setTimeLeft(null);
    }
  }, [currentStep, recipe.steps]);

  const toggleIngredient = (idx: number) => {
    const newIngredients = [...ingredients];
    newIngredients[idx].checked = !newIngredients[idx].checked;
    setIngredients(newIngredients);
  };

  const nextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-stone-900 text-stone-50 flex flex-col z-50 overflow-hidden">
      
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-stone-800 bg-stone-950 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight line-clamp-1">{recipe.name}</h1>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.cookTime} phút</span>
              {recipe.isCustom && <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-[10px] py-0 h-4">Công thức của bạn</Badge>}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
          <span className="text-sm font-medium text-stone-400 whitespace-nowrap">
            Bước {currentStep + 1} / {recipe.steps.length}
          </span>
          <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / recipe.steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-stone-400 hover:text-white hover:bg-stone-800">
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-stone-400 hover:text-white hover:bg-stone-800">
            <Maximize2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT COLUMN: Media & Active Step */}
        <div className="flex-1 flex flex-col border-r border-stone-800 bg-stone-900 relative">
          
          {/* Media Section (Video for Custom, Image for Normal) */}
          <div className="h-1/3 md:h-[45%] bg-black relative flex items-center justify-center overflow-hidden shrink-0">
            {recipe.isCustom && recipe.sourceUrl ? (
              <div className="w-full h-full relative group">
                {/* Mocking video player for UI purposes */}
                <ImageWithFallback src={recipe.imageUrl} alt="Video thumbnail" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/90 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-orange-500 transition-colors shadow-lg hover:scale-105 transform duration-200">
                    <PlayCircle className="w-8 h-8 text-white fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md text-xs font-medium border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Nguồn: YouTube
                </div>
              </div>
            ) : (
              <ImageWithFallback src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
            )}
          </div>

          {/* Active Step Content */}
          <div className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-full font-bold text-sm mb-6 border border-orange-500/20">
                  Bước {recipe.steps[currentStep].number}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                  {recipe.steps[currentStep].title}
                </h2>
                <p className="text-xl text-stone-300 leading-relaxed max-w-3xl">
                  {recipe.steps[currentStep].description}
                </p>

                {/* Timer block if needed */}
                {timeLeft !== null && (
                  <div className="mt-8 p-6 bg-stone-800/50 rounded-2xl border border-stone-700/50 inline-flex flex-col items-center gap-4 backdrop-blur-sm">
                    <div className="text-5xl font-mono tracking-wider font-bold text-orange-400">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        size="lg" 
                        className={isTimerRunning ? "bg-stone-700 hover:bg-stone-600 text-white" : "bg-orange-600 hover:bg-orange-500 text-white"}
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                      >
                        {isTimerRunning ? <PauseCircle className="w-5 h-5 mr-2" /> : <PlayCircle className="w-5 h-5 mr-2" />}
                        {isTimerRunning ? 'Tạm dừng' : 'Bắt đầu bấm giờ'}
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-stone-600 text-stone-300 hover:bg-stone-800 hover:text-white"
                        onClick={() => {
                          setTimeLeft(recipe.steps[currentStep].duration! * 60);
                          setIsTimerRunning(false);
                        }}
                      >
                        Đặt lại
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Navigation Controls */}
          <div className="h-20 border-t border-stone-800 bg-stone-950 flex items-center justify-between px-6 shrink-0">
            <Button 
              variant="ghost" 
              onClick={prevStep} 
              disabled={currentStep === 0}
              className="text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30 text-lg px-6 h-12"
            >
              <ChevronLeft className="w-5 h-5 mr-2" /> Trước đó
            </Button>
            
            {currentStep === recipe.steps.length - 1 ? (
              <Button 
                onClick={() => navigate('/recipes')} 
                className="bg-green-600 hover:bg-green-500 text-white text-lg px-8 h-12 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" /> Hoàn tất nấu ăn
              </Button>
            ) : (
              <Button 
                onClick={nextStep} 
                className="bg-orange-600 hover:bg-orange-500 text-white text-lg px-8 h-12 rounded-xl"
              >
                Tiếp theo <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (Tabs) */}
        <div className="w-full md:w-80 lg:w-96 bg-stone-950 flex flex-col shrink-0">
          
          {/* Tabs Header */}
          <div className="flex border-b border-stone-800 shrink-0">
            <button 
              onClick={() => setActiveTab('steps')}
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'steps' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-400 hover:text-stone-200'}`}
            >
              Các bước
            </button>
            <button 
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ingredients' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-400 hover:text-stone-200'}`}
            >
              Nguyên liệu
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notes' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-400 hover:text-stone-200'}`}
            >
              Ghi chú
            </button>
          </div>

          {/* Tabs Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'steps' && (
              <div className="space-y-3">
                {recipe.steps.map((step, idx) => (
                  <button 
                    key={step.number}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-full text-left p-4 rounded-xl transition-colors border ${
                      currentStep === idx 
                        ? 'bg-orange-500/10 border-orange-500/30' 
                        : idx < currentStep 
                          ? 'bg-stone-900 border-stone-800 opacity-60' 
                          : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                        currentStep === idx 
                          ? 'bg-orange-500 text-white' 
                          : idx < currentStep 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-stone-800 text-stone-400'
                      }`}>
                        {idx < currentStep ? <Check className="w-3 h-3" /> : step.number}
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-1 ${currentStep === idx ? 'text-orange-400' : 'text-stone-200'}`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-sm font-medium text-stone-400">Đã chuẩn bị:</span>
                  <span className="text-sm font-bold text-orange-400">
                    {ingredients.filter(i => i.checked).length} / {ingredients.length}
                  </span>
                </div>
                {ingredients.map((item, idx) => (
                  <label 
                    key={idx} 
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border border-transparent ${
                      item.checked ? 'opacity-50 bg-stone-900/50' : 'bg-stone-900 hover:border-stone-700 hover:bg-stone-800'
                    }`}
                  >
                    <Checkbox 
                      checked={item.checked} 
                      onCheckedChange={() => toggleIngredient(idx)}
                      className="mt-0.5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 border-stone-600"
                    />
                    <div className="flex-1 flex justify-between gap-2">
                      <span className={`text-stone-200 text-sm ${item.checked ? 'line-through' : ''}`}>{item.name}</span>
                      <span className="text-stone-400 text-sm font-medium whitespace-nowrap">{item.amount}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <h4 className="font-semibold text-yellow-500 mb-2 flex items-center gap-2">
                  <ListChecks className="w-4 h-4" /> Ghi chú của bạn
                </h4>
                <p className="text-sm text-yellow-200/70 leading-relaxed whitespace-pre-wrap">
                  {recipe.notes || 'Bạn chưa có ghi chú nào cho món ăn này.'}
                </p>
                <Button variant="outline" size="sm" className="w-full mt-4 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10">
                  Chỉnh sửa ghi chú
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}