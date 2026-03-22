import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, Heart, Share2, Clock, Flame, Users, ChefHat, Play, Printer } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Checkbox } from '../../components/ui/checkbox';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { TopNav } from '../../components/ui/top-nav';
import { toast } from 'sonner';

const mockRecipe = {
  id: 1,
  name: 'Phở bò Hà Nội',
  imageUrl: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?w=800',
  cookTime: 45,
  prepTime: 15,
  calories: 450,
  servings: 2,
  difficulty: 'Trung bình',
  cuisine: 'Miền Bắc',
  mealTypes: ['Sáng', 'Tối'],
  description: 'Phở bò Hà Nội truyền thống với nước dùng trong, thịt bò tái và chín, ăn kèm rau thơm. Một trong những món ăn đại diện cho tinh hoa ẩm thực Việt Nam.',
  isBookmarked: true,
  ingredients: [
    {
      category: 'Nguyên liệu chính',
      items: [
        { name: 'Bánh phở tươi', amount: '400g', checked: false },
        { name: 'Thịt bò nạm', amount: '200g', checked: false },
        { name: 'Thịt bò tái', amount: '100g', checked: false },
        { name: 'Xương ống bò', amount: '500g', checked: false },
        { name: 'Hành tây', amount: '1 củ', checked: false },
        { name: 'Gừng', amount: '50g', checked: false },
      ],
    },
    {
      category: 'Gia vị',
      items: [
        { name: 'Nước mắm', amount: '3 tbsp', checked: false },
        { name: 'Đường phèn', amount: '1 tbsp', checked: false },
        { name: 'Muối', amount: 'vừa ăn', checked: false },
        { name: 'Hạt tiêu', amount: '1 tsp', checked: false },
      ],
    },
    {
      category: 'Trang trí',
      items: [
        { name: 'Hành lá', amount: '1 bó', checked: false },
        { name: 'Giá đỗ', amount: '100g', checked: false },
        { name: 'Rau thơm', amount: '1 bó', checked: false },
        { name: 'Chanh', amount: '2 quả', checked: false },
      ],
    },
  ],
  steps: [
    {
      number: 1,
      title: 'Sơ chế xương bò',
      description: 'Rửa sạch xương ống bò dưới nước chảy. Cho xương vào nồi nước sôi, chần 5 phút để loại bỏ bọt và tạp chất. Vớt xương ra, rửa lại dưới nước lạnh.',
      duration: null,
    },
    {
      number: 2,
      title: 'Hầm nước dùng',
      description: 'Cho xương vào nồi lớn, đổ 3 lít nước lạnh. Thêm gừng nướng và hành tây nướng. Đun sôi, hạ lửa nhỏ liu riu, hầm 3 giờ. Vớt bọt thường xuyên.',
      duration: 180,
    },
    {
      number: 3,
      title: 'Nêm nếm',
      description: 'Cho nước mắm, đường phèn, muối vào nước dùng. Nêm nếm cho vừa ăn. Tiếp tục hầm thêm 30 phút.',
      duration: 30,
    },
    {
      number: 4,
      title: 'Hoàn thành',
      description: 'Trụng bánh phở qua nước sôi. Xếp bánh phở vào tô, cho thịt bò lên trên. Chan nước dùng nóng. Ăn kèm rau thơm, giá, chanh.',
      duration: null,
    },
  ],
  nutrition: {
    calories: 450,
    protein: 35.2,
    carbs: 42.8,
    fat: 15.3,
    fiber: 4.6,
    sodium: 680,
  },
};

export default function RecipeDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [servings, setServings] = useState(mockRecipe.servings);
  const [isBookmarked, setIsBookmarked] = useState(mockRecipe.isBookmarked);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Đã bỏ lưu' : 'Đã lưu vào yêu thích');
  };

  const handleShare = () => {
    toast.success('Đã copy link');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <TopNav />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại danh sách</span>
          </button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleShare} className="gap-2 text-stone-600 border-stone-200">
              <Share2 className="w-4 h-4" />
              Chia sẻ
            </Button>
            <Button variant="outline" className="gap-2 text-stone-600 border-stone-200 hidden sm:flex">
              <Printer className="w-4 h-4" />
              In công thức
            </Button>
            <Button 
              variant={isBookmarked ? "default" : "outline"} 
              onClick={handleBookmark} 
              className={`gap-2 ${isBookmarked ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'text-stone-600 border-stone-200'}`}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
              {isBookmarked ? 'Đã lưu' : 'Lưu'}
            </Button>
          </div>
        </div>

        {/* Top Info Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-72 lg:h-full min-h-[400px]">
              <ImageWithFallback
                src={mockRecipe.imageUrl}
                alt={mockRecipe.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-orange-50 text-orange-700">{mockRecipe.cuisine}</Badge>
                {mockRecipe.mealTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="bg-stone-100 text-stone-700">{type}</Badge>
                ))}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4">{mockRecipe.name}</h1>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">{mockRecipe.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-stone-100 mb-8">
                <div className="flex flex-col gap-1">
                  <span className="text-stone-500 text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" /> Chuẩn bị</span>
                  <span className="font-semibold text-stone-900">{mockRecipe.prepTime} phút</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-stone-500 text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" /> Nấu</span>
                  <span className="font-semibold text-stone-900">{mockRecipe.cookTime} phút</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-stone-500 text-sm flex items-center gap-1.5"><Flame className="w-4 h-4" /> Calories</span>
                  <span className="font-semibold text-stone-900">{mockRecipe.calories} kcal</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-stone-500 text-sm flex items-center gap-1.5"><ChefHat className="w-4 h-4" /> Độ khó</span>
                  <span className="font-semibold text-stone-900">{mockRecipe.difficulty}</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate(`/recipes/${id || 1}/cook`)}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white gap-2 h-12 px-8 text-lg font-medium rounded-xl"
              >
                <Play className="w-5 h-5 fill-current" />
                Bắt đầu nấu
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Ingredients Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-stone-100">
                <h2 className="text-xl font-bold text-stone-900">Nguyên liệu</h2>
                <div className="flex items-center gap-3 bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                  <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-7 h-7 rounded bg-white shadow-sm flex items-center justify-center text-stone-600 hover:text-orange-500 hover:border-orange-200 border border-transparent transition-all">−</button>
                  <span className="font-semibold w-6 text-center text-sm">{servings}</span>
                  <button onClick={() => setServings(servings + 1)} className="w-7 h-7 rounded bg-white shadow-sm flex items-center justify-center text-stone-600 hover:text-orange-500 hover:border-orange-200 border border-transparent transition-all">+</button>
                </div>
              </div>

              {mockRecipe.ingredients.map((group, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <h3 className="font-semibold text-stone-800 mb-3">{group.category}</h3>
                  <div className="space-y-1">
                    {group.items.map((item, itemIdx) => (
                      <label key={itemIdx} className="flex items-center gap-3 p-2.5 hover:bg-orange-50 rounded-lg cursor-pointer group transition-colors">
                        <Checkbox className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                        <span className="flex-1 text-stone-700 group-hover:text-stone-900 transition-colors">{item.name}</span>
                        <span className="text-stone-500 font-medium">{item.amount}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps Right Side */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-stone-100">
              <h2 className="text-2xl font-bold text-stone-900 mb-8">Cách làm</h2>
              <div className="space-y-8">
                {mockRecipe.steps.map((step, index) => (
                  <div key={step.number} className="flex gap-6 relative">
                    {/* Timeline Line */}
                    {index !== mockRecipe.steps.length - 1 && (
                      <div className="absolute left-6 top-14 bottom-[-2rem] w-[2px] bg-stone-100" />
                    )}
                    
                    <div className="w-12 h-12 shrink-0 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl border-4 border-white shadow-sm z-10 relative">
                      {step.number}
                    </div>
                    
                    <div className="flex-1 pb-2">
                      <h3 className="text-lg font-bold text-stone-800 mb-2">{step.title}</h3>
                      <p className="text-stone-600 leading-relaxed mb-4 text-lg">{step.description}</p>
                      
                      {step.duration && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg text-blue-700 border border-blue-100">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Cần canh thời gian: {step.duration} phút</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-stone-100">
              <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Thông tin dinh dưỡng (1 phần)
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="p-4 bg-stone-50 rounded-xl">
                  <div className="text-2xl font-bold text-stone-900 mb-1">{mockRecipe.nutrition.calories}</div>
                  <div className="text-sm text-stone-500 font-medium">Calories</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-700 mb-1">{mockRecipe.nutrition.protein}g</div>
                  <div className="text-sm text-orange-600 font-medium">Protein</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700 mb-1">{mockRecipe.nutrition.carbs}g</div>
                  <div className="text-sm text-blue-600 font-medium">Carbs</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-700 mb-1">{mockRecipe.nutrition.fat}g</div>
                  <div className="text-sm text-yellow-600 font-medium">Fat</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-700 mb-1">{mockRecipe.nutrition.fiber}g</div>
                  <div className="text-sm text-green-600 font-medium">Fiber</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}