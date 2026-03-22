# F1: Onboarding & Taste Profile

## Tổng quan

Feature Onboarding & Taste Profile cho phép người dùng mới tạo hồ sơ khẩu vị cá nhân thông qua bộ câu hỏi nhanh (5-10 câu), giúp hệ thống AI có dữ liệu ban đầu để đưa ra gợi ý món ăn phù hợp ngay từ lần sử dụng đầu tiên. Hỗ trợ nhiều profile trong cùng một gia đình.

## User Stories

### US-OB-01: Hoàn thành quiz onboarding
**Là** người dùng mới,
**Tôi muốn** trả lời bộ câu hỏi ngắn về sở thích ẩm thực,
**Để** ứng dụng hiểu khẩu vị của tôi và gợi ý món ăn phù hợp ngay từ đầu.

**Acceptance Criteria:**
- Bộ quiz gồm 5 màn hình, hoàn thành trong ~2 phút
- Có thể skip toàn bộ quiz (sử dụng default profile)
- Hiển thị progress bar cho biết đang ở bước mấy
- Sau khi hoàn thành, chuyển đến Home screen với gợi ý đầu tiên

### US-OB-02: Chọn vùng miền ẩm thực
**Là** người dùng,
**Tôi muốn** chọn vùng miền ẩm thực ưa thích (Bắc/Trung/Nam/Quốc tế),
**Để** nhận gợi ý món ăn đúng khẩu vị vùng miền.

**Acceptance Criteria:**
- Cho phép chọn nhiều vùng miền (multi-select)
- Có ảnh minh họa cho mỗi vùng miền
- Mặc định không chọn sẵn

### US-OB-03: Thiết lập mức độ khẩu vị
**Là** người dùng,
**Tôi muốn** điều chỉnh mức độ cay/ngọt/mặn ưa thích,
**Để** nhận gợi ý phù hợp với khẩu vị cá nhân.

**Acceptance Criteria:**
- Slider cho mỗi loại: cay, ngọt, mặn (thang 1-5)
- Mặc định ở mức 3 (trung bình)
- Hiển thị icon/emoji tương ứng mức độ

### US-OB-04: Khai báo dị ứng thực phẩm
**Là** người dùng,
**Tôi muốn** khai báo các nguyên liệu dị ứng hoặc không ăn được,
**Để** không bao giờ nhận gợi ý chứa nguyên liệu đó.

**Acceptance Criteria:**
- Danh sách dị ứng phổ biến dạng chip multi-select: hải sản, đậu phộng, gluten, sữa, trứng, đậu nành
- Cho phép thêm nguyên liệu tùy chỉnh (free text)
- Có thể bỏ qua nếu không có dị ứng

### US-OB-05: Chọn chế độ ăn
**Là** người dùng,
**Tôi muốn** chọn chế độ ăn đặc biệt (chay, keto, low-carb, ...),
**Để** nhận gợi ý phù hợp chế độ ăn.

**Acceptance Criteria:**
- Single-select: Bình thường, Chay lacto-ovo, Thuần chay (vegan), Keto, Low-carb, Paleo
- Mặc định chọn "Bình thường"
- Mô tả ngắn cho mỗi chế độ ăn

### US-OB-06: Thiết lập thời gian nấu & số người ăn
**Là** người dùng,
**Tôi muốn** cho biết thời gian nấu chấp nhận được và số người ăn trong gia đình,
**Để** nhận gợi ý món phù hợp thời gian và khẩu phần.

**Acceptance Criteria:**
- Thời gian nấu: chọn 1 trong các mức (< 15 phút, 15-30 phút, 30-60 phút, > 60 phút)
- Số người ăn: number picker (1-10)
- Mặc định: 30-60 phút, 2 người

### US-OB-07: Quản lý nhiều profile gia đình
**Là** người dùng chính (chủ tài khoản),
**Tôi muốn** tạo nhiều profile cho các thành viên gia đình (bố, mẹ, con),
**Để** nhận gợi ý phù hợp với từng người hoặc cả gia đình.

**Acceptance Criteria:**
- Tạo tối đa 6 profile trong 1 tài khoản
- Mỗi profile có tên, avatar, tuổi (khoảng), và taste profile riêng
- Profile chính (chủ tài khoản) không thể xóa
- Có thể chọn active profile hoặc "Cả gia đình" (merge preferences)

### US-OB-08: Cập nhật profile bất kỳ lúc nào
**Là** người dùng,
**Tôi muốn** chỉnh sửa taste profile bất kỳ lúc nào,
**Để** cập nhật khi khẩu vị hoặc chế độ ăn thay đổi.

**Acceptance Criteria:**
- Truy cập từ Settings > Taste Profile
- Thay đổi có hiệu lực ngay lập tức cho gợi ý tiếp theo
- Hiển thị thông báo "Đã cập nhật" sau khi lưu

## Business Rules

1. **BR-OB-01:** Nếu user skip onboarding quiz, tạo default profile với khẩu vị trung bình (mức 3 cho tất cả slider) và chế độ ăn "Bình thường". Hệ thống sẽ dựa vào popularity-based fallback để gợi ý.

2. **BR-OB-02:** Khi tạo profile mới cho thành viên gia đình, kế thừa một số thông tin từ profile chính (vùng miền, số người ăn) nhưng cho phép override.

3. **BR-OB-03:** Khi chọn mode "Cả gia đình", hệ thống merge preferences bằng cách:
   - Loại bỏ TẤT CẢ allergens của mọi thành viên (union)
   - Lấy mức khẩu vị trung bình (average) giữa các thành viên
   - Áp dụng chế độ ăn nghiêm ngặt nhất (ví dụ: nếu 1 người chay thì cả gia đình ăn chay)

4. **BR-OB-04:** Dữ liệu taste profile phải được lưu ngay sau mỗi màn hình quiz (không đợi hoàn thành toàn bộ) để không mất data nếu user thoát giữa chừng.

5. **BR-OB-05:** Tối đa 6 profile gia đình cho tài khoản Free, 10 profile cho tài khoản Pro.

6. **BR-OB-06:** Profile trẻ em (< 12 tuổi) tự động bật filter: không gợi ý món có gia vị mạnh, đồ sống, hoặc đồ uống có caffeine.
