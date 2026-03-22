# F4: Nutrition Tracking (Theo dõi dinh dưỡng)

## Tổng quan

Feature Nutrition Tracking hiển thị thông tin dinh dưỡng chi tiết cho từng recipe và cung cấp dashboard theo dõi dinh dưỡng hàng ngày/hàng tuần. User có thể đặt mục tiêu dinh dưỡng cá nhân và nhận cảnh báo khi vượt hoặc thiếu target. MVP chỉ hiển thị dữ liệu từ meal plan và recipe, chưa hỗ trợ manual food logging.

## User Stories

### US-NT-01: Xem dinh dưỡng per recipe
**Là** gym boy cần track macro chính xác,
**Tôi muốn** xem thông tin dinh dưỡng chi tiết của từng recipe (calories, protein, carb, fat, fiber),
**Để** biết chính xác mình nạp bao nhiêu macro mỗi bữa.

**Acceptance Criteria:**
- Trang recipe detail hiển thị bảng dinh dưỡng: calories, protein, carb, fat, fiber
- Thông tin tính per serving (VD: 1 phần ăn)
- Có thể điều chỉnh số serving để xem dinh dưỡng tổng
- Hiển thị dưới dạng số và biểu đồ tròn (macro breakdown %)
- Dữ liệu tính từ ingredient quantities × nutrition per 100g

### US-NT-02: Kiểm soát đường huyết
**Là** bác Hương (tiểu đường type 2),
**Tôi muốn** xem tổng carb và đường hàng ngày,
**Để** kiểm soát đường huyết và chọn món phù hợp.

**Acceptance Criteria:**
- Dashboard ngày hiển thị tổng carb nổi bật
- Cảnh báo khi tổng carb vượt target cá nhân
- Có thể đặt target carb riêng (VD: < 130g/ngày)
- Gợi ý thay thế khi bữa ăn có quá nhiều carb

### US-NT-03: Dashboard dinh dưỡng hàng ngày
**Là** người dùng,
**Tôi muốn** xem tổng hợp dinh dưỡng trong ngày (từ meal plan),
**Để** biết mình đã nạp bao nhiêu so với mục tiêu.

**Acceptance Criteria:**
- Hiển thị tổng calories, protein, carb, fat, fiber của ngày
- So sánh với target: thanh progress bar cho mỗi macro
- Màu sắc: xanh (trong target), vàng (gần vượt ±10%), đỏ (vượt > 10%)
- Hiển thị từng bữa (sáng/trưa/tối) và contribution của mỗi bữa
- Dữ liệu lấy từ active meal plan

### US-NT-04: Dashboard dinh dưỡng hàng tuần
**Là** người dùng,
**Tôi muốn** xem tổng hợp dinh dưỡng cả tuần,
**Để** đánh giá tổng thể chế độ ăn và điều chỉnh.

**Acceptance Criteria:**
- Biểu đồ bar chart 7 ngày cho mỗi macro (calories, protein, carb, fat)
- Đường target line trên biểu đồ
- Trung bình macro hàng ngày trong tuần
- Highlight ngày vượt hoặc thiếu target (±10%)
- Dữ liệu lấy từ active meal plan

### US-NT-05: Đặt mục tiêu dinh dưỡng cá nhân
**Là** người dùng,
**Tôi muốn** đặt mục tiêu dinh dưỡng hàng ngày (calo, protein, carb, fat),
**Để** hệ thống so sánh và cảnh báo khi tôi ăn quá nhiều/ít.

**Acceptance Criteria:**
- Form nhập target: dailyCalories, protein, carb, fat, fiber (g)
- Có preset cho các mục tiêu phổ biến: giảm cân, tăng cơ, duy trì, tiểu đường
- Target được lưu per profile (mỗi thành viên gia đình có target riêng)
- Có thể sửa target bất kỳ lúc nào

## Business Rules

1. **BR-NT-01:** Hiển thị dinh dưỡng per recipe:
   - Calories (kcal), protein (g), carb (g), fat (g), fiber (g)
   - Tính per serving mặc định, có thể nhân theo số serving
   - Dữ liệu tính từ: ingredient quantity × nutrition per 100g (từ nutrition database)
   - Nếu ingredient thiếu nutrition data, hiển thị "Ước tính" và dùng giá trị trung bình

2. **BR-NT-02:** Dashboard dinh dưỡng hàng ngày / tuần:
   - Daily: tổng hợp từ tất cả bữa ăn trong active meal plan ngày đó
   - Weekly: tổng hợp 7 ngày, tính trung bình
   - Nếu chưa có active meal plan, hiển thị trống với message hướng dẫn tạo plan

3. **BR-NT-03:** Đặt target dinh dưỡng cá nhân:
   - Target mặc định (nếu chưa set): 2,000 kcal, 50g protein, 275g carb, 65g fat, 25g fiber
   - Preset "Giảm cân": 1,500 kcal, 100g protein, 150g carb, 50g fat
   - Preset "Tăng cơ": 2,500 kcal, 180g protein, 300g carb, 70g fat
   - Preset "Tiểu đường": 1,800 kcal, 80g protein, 130g carb, 60g fat
   - Target lưu per profile, áp dụng cho daily/weekly dashboard

4. **BR-NT-04:** Cảnh báo khi vượt / thiếu target:
   - Trong target (±10%): trạng thái "Tốt" (xanh)
   - Gần vượt/thiếu (±10-20%): trạng thái "Chú ý" (vàng)
   - Vượt/thiếu quá 20%: trạng thái "Cảnh báo" (đỏ)
   - Cảnh báo hiển thị trên dashboard, không push notification (MVP)

5. **BR-NT-05:** Tính toán dinh dưỡng:
   - Source: nutrition per 100g table (ingredient-level)
   - Formula: Σ (ingredient_quantity_g × nutrition_per_100g / 100) cho mỗi macro
   - Round: calories → integer, macros → 1 decimal
   - Cache kết quả per recipe (invalidate khi recipe ingredients thay đổi)

6. **BR-NT-06:** MVP scope — chỉ hiển thị, chưa có manual food logging:
   - Dữ liệu dinh dưỡng chỉ tính từ recipe trong meal plan
   - Không hỗ trợ nhập thủ công thức ăn ngoài plan
   - Phase 2 sẽ bổ sung barcode scanning và manual logging
