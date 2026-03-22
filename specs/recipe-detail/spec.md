# F6: Recipe Detail & Cooking Guide

## Tổng quan

Feature Recipe Detail & Cooking Guide cung cấp trang chi tiết món ăn với đầy đủ thông tin (nguyên liệu, dinh dưỡng, vùng miền) và hướng dẫn nấu step-by-step có ảnh minh họa. Hỗ trợ scale nguyên liệu theo số người ăn, timer tích hợp cho các bước cần thời gian, và bookmark/favorite để lưu món yêu thích. Đây là trang user sẽ xem sau khi chọn một gợi ý hoặc tìm kiếm món ăn.

## User Stories

### US-RD-01: Xem hướng dẫn nấu chi tiết
**Là** Hà (người mới học nấu ăn),
**Tôi muốn** xem hướng dẫn nấu từng bước với ảnh minh họa rõ ràng,
**Để** tự tin nấu được món ăn ngon dù chưa có kinh nghiệm.

**Acceptance Criteria:**
- Hiển thị hướng dẫn nấu từng bước (step-by-step)
- Mỗi bước có: số thứ tự, mô tả chi tiết, ảnh minh họa (nếu có)
- Bước hiện tại được highlight, có thể chuyển bước bằng nút hoặc swipe
- Hiển thị tổng số bước và bước hiện tại ("Bước 3/8")
- Video hướng dẫn (nếu có) hiển thị ở đầu trang (Phase 2)

### US-RD-02: Scale nguyên liệu theo số người ăn
**Là** Chị Lan (nấu ăn cho gia đình 5 người),
**Tôi muốn** điều chỉnh số người ăn và thấy lượng nguyên liệu tự động thay đổi,
**Để** nấu đúng khẩu phần mà không phải tự tính toán.

**Acceptance Criteria:**
- Mặc định hiển thị lượng nguyên liệu theo defaultServings của recipe
- Có số (+/-) hoặc picker để thay đổi số người ăn (1-20)
- Lượng nguyên liệu tự động scale theo công thức: `quantity * (desiredServings / defaultServings)`
- Số lượng được làm tròn hợp lý (ví dụ: 1.33 quả trứng → 1 hoặc 2 quả trứng)
- Thông tin dinh dưỡng cũng scale theo số người ăn

### US-RD-03: Sử dụng timer tích hợp
**Là** người dùng đang nấu ăn,
**Tôi muốn** bấm vào "Hầm 45 phút" trong bước hướng dẫn và có timer tự động bật,
**Để** không phải set timer riêng trên điện thoại.

**Acceptance Criteria:**
- Các bước có thời gian cụ thể hiển thị nút timer (ví dụ: "Hầm 45 phút ⏱")
- Bấm nút timer bắt đầu đếm ngược
- Timer hiển thị ở góc màn hình, không che nội dung
- Thông báo (sound + vibration) khi timer kết thúc
- Có thể chạy nhiều timer cùng lúc (Phase 2)

### US-RD-04: Tìm kiếm và duyệt món ăn
**Là** người dùng,
**Tôi muốn** tìm kiếm món ăn theo tên hoặc duyệt theo danh mục (vùng miền, loại bữa, độ khó),
**Để** tìm được món muốn nấu nhanh chóng.

**Acceptance Criteria:**
- Thanh tìm kiếm full-text search (hỗ trợ tiếng Việt có dấu và không dấu)
- Filter theo: vùng miền (Bắc/Trung/Nam/Quốc tế), loại bữa (sáng/trưa/tối/phụ), độ khó (dễ/vừa/khó)
- Kết quả hiển thị dạng grid/list với ảnh, tên, thời gian, calo
- Pagination hoặc infinite scroll
- Kết quả search tự động áp dụng dietary filter của user

### US-RD-05: Bookmark món ăn yêu thích
**Là** người dùng,
**Tôi muốn** bookmark các món ăn yêu thích,
**Để** dễ dàng tìm lại sau này khi muốn nấu lại.

**Acceptance Criteria:**
- Nút bookmark (heart/star icon) trên card và trang chi tiết
- Bấm toggle bookmark on/off
- Trang "Món yêu thích" hiển thị tất cả bookmark, có thể search và filter
- Bookmark được đồng bộ giữa web và mobile

## Business Rules

1. **BR-RD-01:** Thông tin recipe bao gồm:
   - Tên món (tiếng Việt + tên gốc nếu có)
   - Ảnh đại diện (required) + gallery ảnh (optional)
   - Mô tả ngắn (1-2 câu)
   - Vùng miền: Bắc, Trung, Nam, Quốc tế
   - Độ khó: Dễ (easy), Vừa (medium), Khó (hard)
   - Thời gian nấu (phút): prep time + cook time
   - Số người ăn mặc định (defaultServings)
   - Loại bữa: breakfast, lunch, dinner, snack (có thể nhiều)

2. **BR-RD-02:** Nguyên liệu (ingredients):
   - Mỗi nguyên liệu có: tên, số lượng (quantity), đơn vị (unit)
   - Đơn vị hỗ trợ: gram, ml, thìa canh (tbsp), thìa cà phê (tsp), chén, quả, lát, nắm, con, khúc, v.v.
   - Nhóm nguyên liệu: chính (main), gia vị (seasoning), phụ (garnish)
   - Scaling formula: `scaledQuantity = quantity * (desiredServings / defaultServings)`
   - Làm tròn: < 0.25 → bỏ, 0.25-0.75 → 0.5, > 0.75 → làm tròn lên. Với đơn vị nguyên (quả, con): làm tròn lên số nguyên gần nhất.

3. **BR-RD-03:** Hướng dẫn nấu (cooking steps):
   - Mỗi bước có: số thứ tự (stepNumber), mô tả (description), ảnh (imageUrl - optional)
   - Bước có thời gian cụ thể ghi rõ duration (phút) để hỗ trợ timer
   - Video tổng thể recipe (videoUrl - optional, Phase 2)
   - Tối thiểu 2 bước, tối đa 30 bước

4. **BR-RD-04:** Dinh dưỡng (nutrition per serving):
   - Calo (calories), Protein (g), Carb (g), Fat (g)
   - Fiber (g), Sodium (mg) — optional
   - Giá trị dinh dưỡng scale theo servings

5. **BR-RD-05:** Bookmark/Favorite:
   - Mỗi user có thể bookmark unlimited recipes
   - Bookmark là toggle (POST = add, DELETE = remove)
   - Bookmark list hỗ trợ pagination, search, và filter

6. **BR-RD-06:** Tìm kiếm recipe sử dụng Meilisearch:
   - Full-text search tiếng Việt (hỗ trợ không dấu, typo tolerance)
   - Searchable fields: name, description, ingredient names
   - Filterable fields: cuisine, mealType, difficulty, cookTime
   - Sortable fields: cookTime, calories, createdAt, popularity
   - Dietary filter áp dụng tự động dựa trên active profile

7. **BR-RD-07:** Community tips/reviews (Phase 2):
   - User có thể gửi tip ngắn cho recipe
   - Rating 1-5 sao
   - Ảnh user nấu (cooking result photos)
