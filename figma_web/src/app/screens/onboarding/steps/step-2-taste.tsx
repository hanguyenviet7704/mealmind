import { Slider } from '../../../components/ui/slider';

interface Step2TasteProps {
  spiceLevel: number;
  sweetLevel: number;
  saltLevel: number;
  onChange: (values: { spiceLevel: number; sweetLevel: number; saltLevel: number }) => void;
}

export default function Step2Taste({ spiceLevel, sweetLevel, saltLevel, onChange }: Step2TasteProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-stone-800 mb-2">
          Khẩu vị của bạn?
        </h2>
        <p className="text-stone-600">Kéo thanh trượt theo sở thích</p>
      </div>

      <div className="space-y-8">
        {/* Spice Level */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌶️</span>
            <h3 className="font-semibold text-stone-800">Độ cay</h3>
          </div>
          <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
            <span>Không cay</span>
            <span>Rất cay</span>
          </div>
          <Slider
            value={[spiceLevel]}
            onValueChange={([value]) => onChange({ spiceLevel: value, sweetLevel, saltLevel })}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-stone-100 rounded-full text-sm font-medium text-stone-700">
              Giá trị: {spiceLevel}
            </span>
          </div>
        </div>

        {/* Sweet Level */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍬</span>
            <h3 className="font-semibold text-stone-800">Độ ngọt</h3>
          </div>
          <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
            <span>Không ngọt</span>
            <span>Rất ngọt</span>
          </div>
          <Slider
            value={[sweetLevel]}
            onValueChange={([value]) => onChange({ spiceLevel, sweetLevel: value, saltLevel })}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-stone-100 rounded-full text-sm font-medium text-stone-700">
              Giá trị: {sweetLevel}
            </span>
          </div>
        </div>

        {/* Salt Level */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧂</span>
            <h3 className="font-semibold text-stone-800">Độ mặn</h3>
          </div>
          <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
            <span>Nhạt</span>
            <span>Rất mặn</span>
          </div>
          <Slider
            value={[saltLevel]}
            onValueChange={([value]) => onChange({ spiceLevel, sweetLevel, saltLevel: value })}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-stone-100 rounded-full text-sm font-medium text-stone-700">
              Giá trị: {saltLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
