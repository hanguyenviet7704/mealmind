# F2: Smart Meal Suggestion ("Hôm nay ăn gì?")

## Tổng quan

Feature Smart Meal Suggestion là tính năng cốt lõi của MealMind, sử dụng AI để gợi ý món ăn cá nhân hóa dựa trên khẩu vị người dùng, ngữ cảnh (thời tiết, thời gian, mùa), lịch sử ăn uống gần đây, và chế độ ăn kiêng. Mỗi lần gợi ý 3-5 món, user swipe chọn/bỏ qua. Có chế độ "Surprise me" cho người thích khám phá.

## User Stories

### US-MS-01: Nhận gợi ý theo bữa ăn
**Là** người dùng,
**Tôi muốn** nhận gợi ý món ăn phù hợp cho từng bữa (sáng/trưa/tối/bữa phụ),
**Để** không phải suy nghĩ "hôm nay ăn gì" mỗi ngày.

**Acceptance Criteria:**
- Trên Home screen, hiển thị gợi ý cho bữa ăn tiếp theo dựa theo thời gian hiện tại
- Có thể chuyển đổi giữa các loại bữa: Sáng, Trưa, Tối, Bữa phụ
- Mỗi lần hiển thị 3-5 card gợi ý
- Mỗi card hiển thị: ảnh, tên món, thời gian nấu, calo, tag vùng miền

### US-MS-02: Gợi ý theo ngữ cảnh thông minh
**Là** người dùng,
**Tôi muốn** nhận gợi ý phù hợp với thời tiết, ngày trong tuần, và mùa hiện tại,
**Để** món ăn luôn phù hợp với hoàn cảnh.

**Acceptance Criteria:**
- Trời nóng (> 30°C): ưu tiên món mát (gỏi, nộm, canh chua, chè)
- Trời lạnh (< 20°C): ưu tiên món nóng (phở, lẩu, canh hầm)
- Cuối tuần: có thể gợi ý món cầu kỳ hơn (thời gian nấu dài hơn)
- Ngày thường: ưu tiên món nhanh gọn
- Mùa nào thực phẩm nấy (ví dụ: mùa đông nhiều món hầm, mùa hè nhiều rau quả mát)
- Không gợi ý món vừa ăn trong 2 ngày gần đây

### US-MS-03: Swipe chọn/bỏ qua món
**Là** người dùng,
**Tôi muốn** swipe phải để chọn món, swipe trái để bỏ qua,
**Để** tương tác nhanh và trực quan.

**Acceptance Criteria:**
- Swipe phải: chọn món, thêm vào meal log, chuyển đến recipe detail
- Swipe trái: bỏ qua, hiển thị card tiếp theo
- Nút thay thế cho swipe: nút "Chọn" (tick) và "Bỏ qua" (X)
- Khi hết card, hiển thị nút "Xem thêm gợi ý" để load thêm
- Hành vi swipe được ghi lại để cải thiện AI model

### US-MS-04: Chế độ "Surprise me"
**Là** người dùng thích khám phá,
**Tôi muốn** nhấn "Surprise me" để nhận gợi ý món ngẫu nhiên chưa từng thử,
**Để** khám phá ẩm thực mới mẻ.

**Acceptance Criteria:**
- Nút "Surprise me" hiển thị trên Home screen
- Gợi ý món user chưa từng nấu/chọn trước đó
- Ưu tiên món từ vùng miền khác hoặc cuisine khác so với thói quen
- Vẫn tuân thủ dietary restrictions và allergens
- Hiển thị tag "Món mới" và lý do gợi ý ("Thử món miền Trung nhé!")

### US-MS-05: Gợi ý combo bữa ăn hoàn chỉnh
**Là** người nội trợ,
**Tôi muốn** nhận gợi ý combo bữa ăn hoàn chỉnh (món chính + canh + rau + tráng miệng),
**Để** lên được bữa ăn cân bằng, đầy đủ.

**Acceptance Criteria:**
- Chế độ "Combo": gợi ý 1 set gồm 2-4 món bổ sung nhau
- Combo đảm bảo cân bằng: có protein + rau + tinh bột
- Tổng calo combo phù hợp mục tiêu dinh dưỡng
- Có thể swap từng món trong combo mà không ảnh hưởng logic tổng thể
- Hiển thị tổng calo và macro cho toàn bộ combo

### US-MS-06: Xem lý do gợi ý (Explainability)
**Là** người dùng,
**Tôi muốn** biết tại sao một món được gợi ý cho tôi,
**Để** tin tưởng và hiểu hệ thống AI.

**Acceptance Criteria:**
- Mỗi card gợi ý có dòng nhỏ giải thích: "Phù hợp khẩu vị miền Bắc", "Món nhanh cho ngày bận", "Trời lạnh, thử canh nóng", v.v.
- Giải thích ngắn gọn (1 dòng), dễ hiểu
- Tối thiểu 3 loại lý do: taste match, context match, diversity

### US-MS-07: Ghi lại tương tác
**Là** hệ thống,
**Tôi muốn** ghi lại mọi tương tác của user với gợi ý (view, skip, save, cook),
**Để** cải thiện model AI và cá nhân hóa tốt hơn theo thời gian.

**Acceptance Criteria:**
- Ghi lại: recipe_id, action (view/skip/save/cook), timestamp, context
- Data gửi async (không block UI)
- Batch gửi mỗi 30 giây hoặc khi có 10 events

## Business Rules

1. **BR-MS-01:** Gợi ý mặc định dựa trên thời gian hiện tại:
   - 5:00-10:00: Bữa sáng
   - 10:00-14:00: Bữa trưa
   - 14:00-17:00: Bữa phụ
   - 17:00-22:00: Bữa tối
   - 22:00-5:00: Bữa phụ (khuya)

2. **BR-MS-02:** Không gợi ý lại món đã xuất hiện trong lịch sử ăn 2 ngày gần đây. Trừ khi user chỉ có ít hơn 20 món trong database phù hợp filter.

3. **BR-MS-03:** Tỷ lệ gợi ý cho user mới (cold start):
   - 70% món phổ biến (popularity-based)
   - 30% món khám phá (diversity)
   - Sau 10 interactions, chuyển sang content-based filtering

4. **BR-MS-04:** "Surprise me" KHÔNG gợi ý món user đã nấu trong 30 ngày qua. Ưu tiên cuisine/vùng miền mà user ít tương tác nhất.

5. **BR-MS-05:** Combo bữa ăn phải thỏa:
   - 1 món chính (protein chính)
   - 1 canh/soup (tùy chọn)
   - 1 rau/salad
   - Tổng calo trong khoảng ±15% target calo của bữa đó

6. **BR-MS-06:** Mọi gợi ý PHẢI qua filter layer: dietary restrictions, allergens, ingredient blacklist. Không có ngoại lệ.

7. **BR-MS-07:** Rate limiting: tối đa 50 request gợi ý/user/ngày (Free), unlimited cho Pro.

8. **BR-MS-08:** Nếu không thể kết nối weather API, fallback sang gợi ý không có ngữ cảnh thời tiết (graceful degradation).
