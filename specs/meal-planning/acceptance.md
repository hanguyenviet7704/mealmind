# F3: Meal Planning — Acceptance Criteria

## Generate Meal Plan
- [ ] User có thể tạo meal plan cho 1 tuần (7 ngày × 3 bữa)
- [ ] Meal plan respect taste profile và dietary restrictions
- [ ] Không có món trùng lặp trong cùng 1 ngày
- [ ] Không lặp lại cùng 1 món trong 3 ngày liên tiếp
- [ ] Tổng calo/ngày nằm trong ±15% target user (nếu có)
- [ ] Có ít nhất 1 món rau/ngày

## Tùy chỉnh
- [ ] User có thể swap 1 món → nhận 3-5 gợi ý thay thế
- [ ] User có thể lock món yêu thích
- [ ] Regenerate chỉ thay đổi unlocked slots
- [ ] Drag & drop thay đổi vị trí món giữa slots (UI)

## Chia sẻ
- [ ] User có thể share meal plan cho family member
- [ ] Family member có thể xem (read-only) meal plan được share

## API
- [ ] POST /meal-plans tạo meal plan mới
- [ ] GET /meal-plans/:id trả về đầy đủ slots + nutrition summary
- [ ] PATCH /meal-plans/:planId/slots/:slotId swap/lock slot
- [ ] POST /meal-plans/:planId/regenerate regenerate unlocked
- [ ] Response time < 3s cho generate (có thể async)

## UI
- [ ] Calendar view hiển thị 7 ngày × 3 bữa
- [ ] Mỗi slot hiển thị tên món + ảnh + calo
- [ ] Tap slot → recipe detail
- [ ] Lock icon trên slot đã lock
