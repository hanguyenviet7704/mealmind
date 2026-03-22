import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TopNav } from '../../components/ui/top-nav';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent } from '../../components/ui/card';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Link, ImageIcon, Globe, Clock, Flame, Tag, ArrowLeft, Heart, BookmarkPlus, ChefHat } from 'lucide-react';

export default function AddBookmarkScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    imageUrl: '',
    source: 'web',
    category: 'lunch',
    time: '30',
    notes: '',
    ingredients: '',
    steps: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/recipes', { replace: true });
    }, 1000);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'youtube': return <Globe className="w-4 h-4 text-red-500" />;
      case 'tiktok': return <Globe className="w-4 h-4 text-stone-900" />;
      case 'facebook': return <Globe className="w-4 h-4 text-blue-600" />;
      default: return <Globe className="w-4 h-4 text-stone-500" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'youtube': return 'YouTube';
      case 'tiktok': return 'TikTok';
      case 'facebook': return 'Facebook';
      default: return 'Trang web khác';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <TopNav />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Summary */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-stone-500 hover:text-stone-800 transition-colors mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                <BookmarkPlus className="w-8 h-8 text-orange-500" />
                Thêm món ăn đã lưu
              </h1>
              <p className="text-stone-600">Lưu trữ các công thức và món ăn yêu thích từ khắp nơi trên internet.</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button variant="outline" className="border-stone-200 text-stone-700" onClick={() => navigate(-1)}>
                Hủy bỏ
              </Button>
              <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu bookmark'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Content */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-stone-200 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Quick paste section */}
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-orange-100 text-orange-500 mt-1">
                      <Link className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-orange-900 mb-1">Trích xuất tự động từ đường dẫn</h3>
                      <p className="text-sm text-orange-700/80 mb-3">Dán liên kết bài viết, video (YouTube, TikTok), hệ thống sẽ tự động điền các thông tin cơ bản.</p>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="https://..." 
                          className="bg-white border-orange-200 focus-visible:ring-orange-500"
                          value={formData.url}
                          onChange={(e) => handleChange('url', e.target.value)}
                        />
                        <Button type="button" variant="secondary" className="bg-white text-orange-600 border border-orange-200 hover:bg-orange-50">
                          Trích xuất
                        </Button>
                      </div>
                    </div>
                  </div>

                  <hr className="border-stone-100" />

                  {/* Manual Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-stone-500" /> Chi tiết món ăn
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="title" className="text-stone-700 font-medium">Tên món ăn <span className="text-red-500">*</span></Label>
                        <Input 
                          id="title" 
                          placeholder="VD: Phở bò gia truyền, Bánh canh cua..." 
                          className="focus-visible:ring-orange-500"
                          value={formData.title}
                          onChange={(e) => handleChange('title', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="source" className="text-stone-700 font-medium">Nguồn sưu tầm</Label>
                        <Select value={formData.source} onValueChange={(val) => handleChange('source', val)}>
                          <SelectTrigger className="focus:ring-orange-500">
                            <SelectValue placeholder="Chọn nguồn" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web">Trang web / Blog</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-stone-700 font-medium">Phân loại món</Label>
                        <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
                          <SelectTrigger className="focus:ring-orange-500">
                            <SelectValue placeholder="Chọn phân loại" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breakfast">Bữa sáng</SelectItem>
                            <SelectItem value="lunch">Bữa trưa / tối (Món mặn)</SelectItem>
                            <SelectItem value="soup">Món canh / súp</SelectItem>
                            <SelectItem value="snack">Ăn vặt / Tráng miệng</SelectItem>
                            <SelectItem value="drink">Đồ uống</SelectItem>
                            <SelectItem value="vegetarian">Món chay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time" className="text-stone-700 font-medium">Thời gian chuẩn bị & nấu</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <Input 
                            id="time" 
                            type="number"
                            placeholder="Số phút" 
                            className="pl-9 focus-visible:ring-orange-500"
                            value={formData.time}
                            onChange={(e) => handleChange('time', e.target.value)}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">phút</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="imageUrl" className="text-stone-700 font-medium">Liên kết hình ảnh minh họa</Label>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <Input 
                            id="imageUrl" 
                            placeholder="https://... (.jpg, .png)" 
                            className="pl-9 focus-visible:ring-orange-500"
                            value={formData.imageUrl}
                            onChange={(e) => handleChange('imageUrl', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="ingredients" className="text-stone-700 font-medium">Nguyên liệu (Tùy chọn)</Label>
                        <Textarea 
                          id="ingredients" 
                          placeholder="Mỗi dòng 1 nguyên liệu. VD:&#10;500g thịt bò&#10;1 củ hành tây..." 
                          className="min-h-[120px] focus-visible:ring-orange-500"
                          value={formData.ingredients}
                          onChange={(e) => handleChange('ingredients', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="steps" className="text-stone-700 font-medium">Cách làm (Tùy chọn)</Label>
                        <Textarea 
                          id="steps" 
                          placeholder="Mỗi dòng 1 bước. VD:&#10;1. Sơ chế nguyên liệu...&#10;2. Ướp thịt bò trong 15 phút..." 
                          className="min-h-[160px] focus-visible:ring-orange-500"
                          value={formData.steps}
                          onChange={(e) => handleChange('steps', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes" className="text-stone-700 font-medium">Ghi chú cá nhân</Label>
                        <Textarea 
                          id="notes" 
                          placeholder="Mẹo nhỏ, thành phần cần thay thế, hoặc ghi chú riêng biệt để món ngon hơn..." 
                          className="min-h-[100px] resize-none focus-visible:ring-orange-500"
                          value={formData.notes}
                          onChange={(e) => handleChange('notes', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Preview */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-lg font-semibold text-stone-800">Xem trước hiển thị</h2>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden sticky top-6"
            >
              <div className="relative h-48 bg-stone-100 flex items-center justify-center overflow-hidden">
                {formData.imageUrl ? (
                  <ImageWithFallback
                    src={formData.imageUrl}
                    alt={formData.title || 'Preview'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm text-stone-400">Chưa có hình ảnh</p>
                  </div>
                )}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-orange-500 shadow-sm">
                  <Heart className="w-4 h-4 fill-orange-500" />
                </div>
                
                {formData.source && formData.source !== 'other' && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium text-stone-700 shadow-sm">
                    {getSourceIcon(formData.source)}
                    {getSourceLabel(formData.source)}
                  </div>
                )}
              </div>
              
              <div className="p-5 flex flex-col">
                <div className="flex gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
                    <Tag className="w-3 h-3 mr-1" /> Custom
                  </span>
                  {formData.category === 'vegetarian' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      Món chay
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-stone-800 mb-2 line-clamp-2 min-h-[56px]">
                  {formData.title || 'Tên món ăn sẽ hiển thị ở đây'}
                </h3>
                
                <p className="text-sm text-stone-500 mb-4 line-clamp-2 min-h-[40px]">
                  {formData.notes || 'Thêm ghi chú cá nhân cho công thức này để dễ dàng theo dõi sau này.'}
                </p>

                <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> {formData.time || '0'}p</span>
                    <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500" /> -- kcal</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hint Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <div className="text-blue-500 mt-0.5">💡</div>
              <div>
                <h4 className="font-semibold text-blue-900 text-sm mb-1">Mẹo hay</h4>
                <p className="text-sm text-blue-800/80 leading-relaxed">
                  Cài đặt <a href="#" className="font-medium underline hover:text-blue-900">Tiện ích mở rộng MealMind</a> để thêm món ăn từ bất kỳ trang web nào chỉ với một cú click chuột!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}