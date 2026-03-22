# Master Data & Enums

Tài liệu định nghĩa tất cả enum, lookup table, và master data dùng chung toàn hệ thống. Mọi agent PHẢI dùng đúng giá trị này — KHÔNG tự tạo giá trị mới.

## Enums

### cuisine_type — Vùng miền ẩm thực

| Value | Display (VI) | Description |
|-------|-------------|-------------|
| `north` | Miền Bắc | Phở, bún chả, bánh cuốn, nem rán... |
| `central` | Miền Trung | Bún bò Huế, mì Quảng, bánh bèo... |
| `south` | Miền Nam | Hủ tiếu, bánh mì, cơm tấm, lẩu... |
| `international` | Quốc tế | Món Hàn, Nhật, Ý, Thái, Trung Hoa... |

### meal_type — Loại bữa ăn

| Value | Display (VI) | Time range |
|-------|-------------|------------|
| `breakfast` | Bữa sáng | 05:00 - 10:00 |
| `lunch` | Bữa trưa | 10:00 - 14:00 |
| `dinner` | Bữa tối | 17:00 - 22:00 |
| `snack` | Bữa phụ | 14:00 - 17:00 hoặc 22:00 - 05:00 |

### difficulty_level — Độ khó

| Value | Display (VI) | Cook time hint |
|-------|-------------|---------------|
| `easy` | Dễ | < 30 phút, ít bước, nguyên liệu đơn giản |
| `medium` | Trung bình | 30-60 phút, kỹ thuật cơ bản |
| `hard` | Khó | > 60 phút, kỹ thuật nâng cao, nhiều bước |

### diet_type — Chế độ ăn

| Value | Display (VI) | Rules |
|-------|-------------|-------|
| `normal` | Bình thường | Không giới hạn |
| `lacto_ovo_vegetarian` | Chay (trứng + sữa) | Không thịt, không cá, OK trứng + sữa |
| `vegan` | Thuần chay | Không sản phẩm động vật |
| `keto` | Keto | < 20g carb/ngày, high fat |
| `low_carb` | Low-carb | < 100g carb/ngày |
| `paleo` | Paleo | Không ngũ cốc, không sữa, không đậu, không đường tinh luyện |

### allergen_type — Dị ứng thực phẩm

| Value | Display (VI) | Ingredients to exclude |
|-------|-------------|----------------------|
| `shellfish` | Hải sản có vỏ | Tôm, cua, ghẹ, sò, hàu, ốc |
| `fish` | Cá | Cá các loại, nước mắm (cần confirm) |
| `peanuts` | Đậu phộng | Đậu phộng, bơ đậu phộng |
| `gluten` | Gluten | Lúa mì, lúa mạch, yến mạch, mì các loại |
| `dairy` | Sữa | Sữa, phô mai, bơ, kem, sữa chua |
| `eggs` | Trứng | Trứng gà, trứng vịt, trứng cút |
| `soy` | Đậu nành | Đậu nành, đậu hũ, tương, nước tương |
| `tree_nuts` | Hạt cây | Hạnh nhân, óc chó, hạt điều, hạt macca |

### medical_condition — Bệnh lý (Phase 2 filter, Phase 1 master data)

| Value | Display (VI) | Filter rules |
|-------|-------------|-------------|
| `diabetes` | Tiểu đường | Loại GI cao, đường cao (> 10g sugar/serving) |
| `hypertension` | Huyết áp cao | Loại sodium > 600mg/serving |
| `gout` | Gout | Loại purine_level = high (nội tạng, hải sản đậm) |
| `kidney` | Bệnh thận | Loại protein > 25g/serving, kali cao |

### religious_diet — Tôn giáo

| Value | Display (VI) | Rules |
|-------|-------------|-------|
| `none` | Không | Mặc định |
| `buddhist_lunar` | Chay Phật giáo | Ăn chay ngày rằm (15 âm) + mùng 1 |
| `halal` | Halal | Không thịt heo, không rượu/bia, không mỡ heo |
| `kosher` | Kosher | Tách meat/dairy, không shellfish, không thịt heo |

### age_range — Nhóm tuổi (family profile)

| Value | Display (VI) | Special rules |
|-------|-------------|--------------|
| `child_under_6` | Trẻ < 6 tuổi | Auto-filter: không gia vị mạnh, không đồ sống, không caffeine |
| `child_6_12` | Trẻ 6-12 tuổi | Auto-filter: không gia vị mạnh, không đồ sống |
| `teen` | Thiếu niên (13-17) | Không filter đặc biệt |
| `adult` | Người lớn (18-59) | Mặc định |
| `senior` | Người cao tuổi (60+) | Ưu tiên món dễ tiêu, ít dầu mỡ |

### cook_time_range — Thời gian nấu chấp nhận

| Value | Display (VI) | Minutes |
|-------|-------------|---------|
| `under_15` | Dưới 15 phút | 0-15 |
| `15_to_30` | 15-30 phút | 15-30 |
| `30_to_60` | 30-60 phút | 30-60 |
| `over_60` | Trên 60 phút | 60+ |

### ingredient_category — Nhóm nguyên liệu

| Value | Display (VI) |
|-------|-------------|
| `protein` | Thịt, cá, trứng, đậu hũ |
| `vegetable` | Rau củ |
| `fruit` | Trái cây |
| `grain` | Ngũ cốc, gạo, mì |
| `dairy` | Sữa, phô mai |
| `seasoning` | Gia vị |
| `oil` | Dầu ăn, mỡ |
| `other` | Khác |

### ingredient_group — Vai trò trong recipe

| Value | Display (VI) | Description |
|-------|-------------|-------------|
| `main` | Nguyên liệu chính | Bắt buộc |
| `seasoning` | Gia vị | Bắt buộc nhưng lượng nhỏ |
| `garnish` | Trang trí / phụ | Optional |

### interaction_action — Hành vi user

| Value | Display | Weight cho ML |
|-------|---------|--------------|
| `view` | Xem recipe detail | +0.1 |
| `skip` | Bỏ qua gợi ý | -0.3 |
| `save` | Bookmark/favorite | +0.5 |
| `cook` | Đã nấu | +1.0 |

### interaction_source — Nguồn tương tác

| Value | Description |
|-------|-------------|
| `home` | Gợi ý trên Home screen |
| `search` | Tìm kiếm |
| `combo` | Combo suggestion |
| `surprise` | "Surprise me" |
| `meal_plan` | Từ meal plan |

### plan_status — Trạng thái meal plan

| Value | Display (VI) | Description |
|-------|-------------|-------------|
| `draft` | Nháp | Đang chỉnh sửa |
| `active` | Đang dùng | Chỉ 1 plan active / user |
| `archived` | Lưu trữ | Hết tuần hoặc user archive |

### subscription_tier

| Value | Limits |
|-------|--------|
| `free` | 3 gợi ý/bữa, 1 dietary filter, 6 family profiles, 50 requests/ngày |
| `pro` | Unlimited gợi ý, unlimited filters, 10 family profiles, unlimited requests |

## Measurement Units (cho recipe_ingredients)

| Unit | Display (VI) | Category |
|------|-------------|----------|
| `g` | gram | weight |
| `kg` | kg | weight |
| `ml` | ml | volume |
| `l` | lít | volume |
| `tbsp` | thìa canh | volume (~15ml) |
| `tsp` | thìa cà phê | volume (~5ml) |
| `cup` | chén | volume (~240ml) |
| `piece` | quả / miếng / con | countable |
| `slice` | lát | countable |
| `bunch` | nắm / bó | countable |
| `clove` | tép (tỏi) | countable |
| `pinch` | nhúm | tiny |
| `to_taste` | vừa ăn | no quantity |

## Season Mapping (Vietnam)

| Value | Months | Ingredients hint |
|-------|--------|-----------------|
| `spring` | Feb - Apr | Rau mầm, măng, mồng tơi |
| `summer` | May - Jul | Dưa hấu, rau muống, bầu bí |
| `autumn` | Aug - Oct | Bưởi, hồng, cốm, sen |
| `winter` | Nov - Jan | Su hào, cải, bắp cải, khoai |

## Weather Thresholds (cho context engine)

| Condition | Temperature (°C) | Suggestion bias |
|-----------|------------------|----------------|
| `hot` | > 33 | Món mát: gỏi, nộm, chè, nước ép |
| `warm` | 26-33 | Bình thường, ưu tiên món nhẹ |
| `cool` | 20-26 | Bình thường |
| `cold` | < 20 | Món nóng: phở, lẩu, canh hầm |
| `rainy` | any + rain | Món nóng, comfort food |
