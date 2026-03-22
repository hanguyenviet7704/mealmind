# F4: Nutrition Tracking - Tasks

## Backend (NestJS)

- [ ] NT-001: Nutrition info per recipe API — Implement GET /recipes/:id/nutrition:
  - Tính toán dinh dưỡng từ ingredient quantities × nutrition per 100g
  - Trả calories, protein, carb, fat, fiber per serving
  - Hỗ trợ query param `servings` để tính cho nhiều phần
  - Cache kết quả per recipe, invalidate khi recipe ingredients thay đổi
  - Nếu ingredient thiếu nutrition data, dùng giá trị ước tính và đánh flag

- [ ] NT-002: Daily/weekly nutrition summary API — Implement 2 endpoints:
  - GET /nutrition/daily?date=YYYY-MM-DD: tổng hợp nutrition từ active meal plan ngày đó, breakdown per bữa (sáng/trưa/tối), so sánh với target goals
  - GET /nutrition/weekly?weekStart=YYYY-MM-DD: tổng hợp 7 ngày, tính trung bình, highlight ngày lệch target > 10%
  - GET /nutrition/goals: trả current nutrition goals per profile
  - PUT /nutrition/goals: cập nhật goals (custom hoặc preset)
  - Goals presets: maintain, weight_loss, muscle_gain, diabetic

## Frontend (Web + Mobile)

- [ ] NT-003: Nutrition display UI (recipe detail) — Implement hiển thị dinh dưỡng trên trang recipe detail:
  - Bảng dinh dưỡng: calories, protein, carb, fat, fiber
  - Biểu đồ tròn macro breakdown (% protein, carb, fat)
  - Serving selector để điều chỉnh số phần
  - Tag "Ước tính" nếu có ingredient thiếu data
  - Web: component trong recipe detail page
  - Mobile: section trong recipe detail screen

- [ ] NT-004: Daily nutrition dashboard UI — Implement dashboard dinh dưỡng hàng ngày:
  - Progress bar cho mỗi macro (calories, protein, carb, fat, fiber)
  - Màu sắc theo trạng thái: xanh (tốt), vàng (chú ý), đỏ (cảnh báo)
  - Breakdown bữa ăn (sáng/trưa/tối) với contribution %
  - Weekly bar chart (7 ngày) với target line
  - Form đặt/sửa nutrition goals (custom + presets)
  - Empty state khi chưa có active meal plan
  - Web: dashboard page hoặc tab trong meal plan view
  - Mobile: dashboard screen với scrollable sections
