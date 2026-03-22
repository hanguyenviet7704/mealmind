# F3: Weekly Meal Planning (Lên thực đơn tuần)

## Tổng quan

Feature Weekly Meal Planning cho phép user tự động tạo thực đơn 7 ngày × 3 bữa (sáng/trưa/tối) dựa trên sở thích, chế độ ăn, và mục tiêu dinh dưỡng. Hệ thống gọi recommendation service để generate plan cân bằng dinh dưỡng, hỗ trợ tùy chỉnh linh hoạt (drag & drop, lock/regenerate), chia sẻ cho thành viên gia đình, và xuất PDF/ảnh.

## User Stories

### US-MP-01: Tạo thực đơn 7 ngày tự động
**Là** mẹ bận rộn,
**Tôi muốn** hệ thống tự động tạo thực đơn cho cả tuần (7 ngày × 3 bữa),
**Để** không phải nghĩ menu mỗi ngày, tiết kiệm thời gian lên kế hoạch.

**Acceptance Criteria:**
- Nhấn "Tạo thực đơn tuần" để generate plan mới
- Plan bao gồm 21 slot (7 ngày × 3 bữa: sáng, trưa, tối)
- Mỗi slot gồm 1-3 món ăn phù hợp bữa đó
- Plan dựa trên taste profile, dietary restrictions, và nutrition goals của user
- Thời gian generate < 5 giây

### US-MP-02: Meal prep theo macro
**Là** gym boy muốn tăng cơ,
**Tôi muốn** tạo thực đơn tuần tối ưu theo macro (protein/carb/fat),
**Để** meal prep hiệu quả, đạt mục tiêu dinh dưỡng hàng tuần.

**Acceptance Criteria:**
- Khi tạo plan, có thể chọn mục tiêu dinh dưỡng (VD: 2,500 kcal/ngày, 180g protein)
- Plan phân bổ macro đều qua các bữa trong ngày
- Hiển thị tổng macro hàng ngày và hàng tuần
- Có thể chọn chế độ "Meal prep friendly" — ưu tiên món dễ nấu trước, bảo quản tốt

### US-MP-03: Tùy chỉnh thực đơn
**Là** người dùng,
**Tôi muốn** thay đổi vị trí món ăn trong thực đơn (drag & drop),
**Để** sắp xếp lại theo ý muốn cá nhân.

**Acceptance Criteria:**
- Drag & drop món từ slot này sang slot khác
- Swap 2 món giữa 2 slot bất kỳ
- Khi swap, nutrition summary được tính lại realtime
- Undo/redo thay đổi (ít nhất 5 bước)

### US-MP-04: Lock món yêu thích
**Là** người dùng,
**Tôi muốn** lock những món tôi thích trong plan, rồi regenerate phần còn lại,
**Để** giữ lại món ưng ý mà vẫn đổi mới các bữa khác.

**Acceptance Criteria:**
- Nút lock/unlock trên mỗi slot
- Khi nhấn "Regenerate", chỉ thay đổi các slot chưa lock
- Các slot mới vẫn đảm bảo cân bằng dinh dưỡng với slot đã lock
- Hiển thị rõ trạng thái lock (icon khóa)

### US-MP-05: Chia sẻ meal plan cho gia đình
**Là** người nội trợ,
**Tôi muốn** chia sẻ thực đơn tuần cho các thành viên trong gia đình,
**Để** mọi người đều biết menu và có thể góp ý.

**Acceptance Criteria:**
- Share plan qua link hoặc trực tiếp cho family members trong app
- Người nhận có thể xem plan (read-only) hoặc được cấp quyền edit
- Thông báo khi plan được cập nhật
- Tối đa 10 người share cùng 1 plan

### US-MP-06: Xuất thực đơn PDF/ảnh
**Là** người dùng,
**Tôi muốn** xuất thực đơn tuần dưới dạng PDF hoặc ảnh,
**Để** in ra dán tủ lạnh hoặc gửi cho người thân.

**Acceptance Criteria:**
- Xuất PDF format A4, layout bảng 7 cột × 3 hàng
- Xuất ảnh (PNG/JPG) tối ưu cho chia sẻ mạng xã hội
- PDF bao gồm: tên món, calo mỗi bữa, tổng calo mỗi ngày
- Có branding MealMind nhẹ nhàng (logo góc)

## Business Rules

1. **BR-MP-01:** Cân bằng dinh dưỡng tự động:
   - Không ăn cùng loại protein chính (thịt bò, thịt gà, cá, ...) liên tục 3 ngày
   - Đảm bảo ít nhất 1 bữa có rau xanh mỗi ngày
   - Phân bổ calo hàng ngày: Sáng ~25%, Trưa ~40%, Tối ~35% (có thể tùy chỉnh)
   - Tổng calo hàng ngày trong khoảng ±10% target

2. **BR-MP-02:** Drag & drop thay đổi vị trí món:
   - Cho phép kéo thả món giữa bất kỳ slot nào trong plan
   - Khi drop, tự động swap 2 món (không xóa)
   - Nutrition summary cập nhật realtime

3. **BR-MP-03:** Lock món yêu thích, regenerate phần còn lại:
   - Slot bị lock không bị thay đổi khi regenerate
   - Regenerate phải tính nutrition của slot đã lock để cân bằng phần còn lại
   - Tối đa lock 70% slots (ít nhất 30% phải regenerate để đảm bảo đa dạng)

4. **BR-MP-04:** Chia sẻ meal plan cho thành viên gia đình:
   - Share via invite link (expire sau 7 ngày) hoặc direct invite (by userId/email)
   - Quyền: viewer (xem) hoặc editor (xem + sửa)
   - Owner luôn có full quyền, không thể bị revoke
   - Tối đa 10 collaborators per plan

5. **BR-MP-05:** Xuất PDF / ảnh thực đơn tuần:
   - PDF generate server-side, trả về URL download
   - Cache PDF 1 giờ (invalidate khi plan thay đổi)
   - Format: landscape A4, bảng 7 cột (Thứ 2 → CN) × 3 hàng (Sáng/Trưa/Tối)

6. **BR-MP-06:** Gọi recommendation service để generate plan:
   - API gửi request đến Python recommendation service
   - Input: taste profile, dietary restrictions, nutrition goals, locked slots
   - Output: 21 recipe assignments (7 ngày × 3 bữa)
   - Timeout: 10 giây, retry 1 lần, fallback sang popularity-based nếu fail

7. **BR-MP-07:** Plan status lifecycle:
   - `draft` → mới tạo, đang chỉnh sửa
   - `active` → đang sử dụng (chỉ 1 plan active tại 1 thời điểm per user)
   - `archived` → đã hết tuần hoặc user archive thủ công
   - Khi activate plan mới, plan cũ tự động archive

8. **BR-MP-08:** Mỗi user tối đa 4 plan ở trạng thái draft cùng lúc. Không giới hạn archived plans.
