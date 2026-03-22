# F4: Nutrition Tracking - Acceptance Criteria

## Dinh dưỡng per recipe

- [ ] Trang recipe detail hiển thị bảng dinh dưỡng: calories, protein, carb, fat, fiber
- [ ] Thông tin dinh dưỡng tính per serving
- [ ] Có thể điều chỉnh số serving, dinh dưỡng tính lại tương ứng
- [ ] Hiển thị macro breakdown dạng biểu đồ tròn (% protein, carb, fat)
- [ ] Tính toán từ ingredient quantities × nutrition per 100g
- [ ] Nếu ingredient thiếu nutrition data, hiển thị tag "Ước tính"
- [ ] API GET /recipes/:id/nutrition trả đầy đủ nutrition data

## Dashboard dinh dưỡng hàng ngày

- [ ] Hiển thị tổng calories, protein, carb, fat, fiber cho ngày được chọn
- [ ] Progress bar cho mỗi macro so với target
- [ ] Màu sắc: xanh (trong target ±10%), vàng (±10-20%), đỏ (> 20%)
- [ ] Breakdown theo từng bữa (sáng/trưa/tối) với contribution mỗi bữa
- [ ] Dữ liệu lấy từ active meal plan
- [ ] Nếu chưa có active meal plan, hiển thị trống với hướng dẫn tạo plan
- [ ] API GET /nutrition/daily?date= trả nutrition summary

## Dashboard dinh dưỡng hàng tuần

- [ ] Biểu đồ bar chart 7 ngày cho calories
- [ ] Biểu đồ bar chart 7 ngày cho protein, carb, fat
- [ ] Đường target line hiển thị trên biểu đồ
- [ ] Hiển thị trung bình macro hàng ngày trong tuần
- [ ] Highlight ngày vượt hoặc thiếu target (±10%)
- [ ] API GET /nutrition/weekly?weekStart= trả weekly summary

## Mục tiêu dinh dưỡng

- [ ] User có thể đặt target: dailyCalories, protein, carb, fat, fiber
- [ ] Có preset: Giảm cân, Tăng cơ, Duy trì, Tiểu đường
- [ ] Target mặc định: 2,000 kcal, 50g protein, 275g carb, 65g fat, 25g fiber
- [ ] Target lưu per profile (mỗi thành viên gia đình riêng)
- [ ] User có thể sửa target bất kỳ lúc nào
- [ ] API GET /nutrition/goals trả current goals
- [ ] API PUT /nutrition/goals cập nhật goals

## Cảnh báo dinh dưỡng

- [ ] Trạng thái "Tốt" (xanh) khi macro trong khoảng ±10% target
- [ ] Trạng thái "Chú ý" (vàng) khi macro lệch ±10-20% target
- [ ] Trạng thái "Cảnh báo" (đỏ) khi macro lệch > 20% target
- [ ] Cảnh báo hiển thị trực tiếp trên dashboard (không push notification)

## Performance

- [ ] GET /recipes/:id/nutrition response time < 200ms
- [ ] GET /nutrition/daily response time < 300ms
- [ ] GET /nutrition/weekly response time < 500ms
- [ ] Nutrition data per recipe được cache, invalidate khi ingredients thay đổi
- [ ] Dashboard render < 300ms sau khi nhận data
