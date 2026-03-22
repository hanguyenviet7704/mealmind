# F1: Onboarding & Taste Profile - Acceptance Criteria

## Quiz Flow

- [ ] User mới sau khi đăng ký được chuyển đến quiz onboarding
- [ ] Quiz gồm 5 màn hình với progress bar hiển thị bước hiện tại
- [ ] Màn hình 1: Chọn vùng miền ẩm thực (multi-select: Bắc/Trung/Nam/Quốc tế) với ảnh minh họa
- [ ] Màn hình 2: Slider khẩu vị (cay/ngọt/mặn) thang 1-5, mặc định mức 3
- [ ] Màn hình 3: Multi-select chip dị ứng (hải sản, đậu phộng, gluten, sữa, trứng, đậu nành) + trường nhập tùy chỉnh
- [ ] Màn hình 4: Single-select chế độ ăn (Bình thường, Chay lacto-ovo, Thuần chay, Keto, Low-carb, Paleo) với mô tả ngắn
- [ ] Màn hình 5: Chọn thời gian nấu (< 15p, 15-30p, 30-60p, > 60p) và number picker số người ăn (1-10)
- [ ] Mỗi bước được auto-save khi user chuyển sang bước tiếp theo
- [ ] User có thể quay lại bước trước để chỉnh sửa
- [ ] Sau khi hoàn thành bước cuối, chuyển đến Home screen với gợi ý đầu tiên
- [ ] Toàn bộ quiz hoàn thành trong <= 2 phút (UX benchmark)

## Skip Quiz

- [ ] Nút "Bỏ qua" hiển thị ở mọi bước của quiz
- [ ] Khi skip, tạo default profile: khẩu vị mức 3, chế độ ăn bình thường, 30-60 phút, 2 người
- [ ] Sau khi skip, chuyển đến Home screen bình thường
- [ ] User vẫn có thể hoàn thành quiz sau từ Settings

## Resume Quiz

- [ ] Nếu user thoát app giữa chừng quiz, khi mở lại sẽ tiếp tục từ bước đã dừng
- [ ] Data các bước đã hoàn thành không bị mất
- [ ] API GET /onboarding/quiz/progress trả về đúng trạng thái

## Taste Profile CRUD

- [ ] Xem taste profile từ Settings > Taste Profile
- [ ] Chỉnh sửa bất kỳ field nào trong taste profile
- [ ] Thay đổi được lưu ngay khi nhấn Save
- [ ] Gợi ý mới phản ánh thay đổi profile ngay lập tức
- [ ] Hiển thị thông báo xác nhận "Đã cập nhật hồ sơ khẩu vị"

## Multi-Profile (Family)

- [ ] Tạo thêm profile gia đình từ Settings > Gia đình
- [ ] Mỗi profile có: tên, avatar, khoảng tuổi, taste profile riêng
- [ ] Tạo tối đa 6 profile (Free) hoặc 10 profile (Pro)
- [ ] Hiển thị lỗi khi vượt quá giới hạn số profile
- [ ] Profile chính (chủ tài khoản) không có nút xóa
- [ ] Xóa profile phụ hiển thị dialog xác nhận
- [ ] Chuyển đổi active profile từ header/drawer
- [ ] Chọn mode "Cả gia đình" merge preferences đúng rule:
  - Allergens: union tất cả
  - Khẩu vị: trung bình cộng
  - Chế độ ăn: nghiêm ngặt nhất

## Profile trẻ em

- [ ] Profile với ageRange = child_under_6 hoặc child_6_12 tự động bật filter trẻ em
- [ ] Filter trẻ em loại bỏ: gia vị mạnh, đồ sống, đồ uống có caffeine
- [ ] Filter trẻ em áp dụng tự động, không cần user cấu hình

## API Validation

- [ ] POST /onboarding/quiz trả 201 khi submit thành công
- [ ] POST /onboarding/quiz trả 400 khi data không hợp lệ
- [ ] PATCH /taste-profiles/:id trả 200 khi update thành công
- [ ] PATCH /taste-profiles/:id trả 404 khi profileId không tồn tại
- [ ] POST /family-profiles trả 400 khi đạt max profile limit
- [ ] DELETE /family-profiles/:id trả 403 khi xóa primary profile
- [ ] Tất cả endpoints yêu cầu authentication (401 nếu không có token)

## Performance

- [ ] Quiz submit response time < 200ms
- [ ] Profile update response time < 200ms
- [ ] Profile list load time < 150ms
