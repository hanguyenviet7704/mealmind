# F2: Smart Meal Suggestion - Acceptance Criteria

## Gợi ý theo bữa ăn

- [ ] Home screen hiển thị gợi ý cho bữa ăn tiếp theo dựa theo thời gian hiện tại
- [ ] Auto-detect bữa ăn: Sáng (5-10h), Trưa (10-14h), Bữa phụ (14-17h), Tối (17-22h), Khuya (22-5h)
- [ ] Có thể chuyển đổi thủ công giữa các loại bữa bằng tab/selector
- [ ] Mỗi lần hiển thị 3-5 card gợi ý
- [ ] Mỗi card hiển thị: ảnh món, tên, thời gian nấu, calo, tag vùng miền
- [ ] Gợi ý tuân thủ dietary restrictions và allergens của active profile

## Ngữ cảnh thông minh (Context-aware)

- [ ] Trời nóng (> 30°C): ưu tiên gợi ý món mát (gỏi, nộm, canh chua)
- [ ] Trời lạnh (< 20°C): ưu tiên gợi ý món nóng (phở, lẩu, canh hầm)
- [ ] Cuối tuần: cho phép gợi ý món có thời gian nấu dài hơn
- [ ] Ngày thường: ưu tiên món nhanh gọn (dưới maxCookTime)
- [ ] Không gợi ý lại món đã ăn trong 2 ngày gần đây
- [ ] Nếu weather API không available, gợi ý bình thường (graceful degradation)

## Swipe chọn/bỏ qua

- [ ] Swipe phải trên card: chọn món, ghi interaction "save", chuyển đến recipe detail
- [ ] Swipe trái trên card: bỏ qua, ghi interaction "skip", hiển thị card tiếp theo
- [ ] Nút "Chọn" (tick) và "Bỏ qua" (X) hoạt động tương đương swipe
- [ ] Animation swipe mượt mà (< 16ms per frame)
- [ ] Khi hết card, hiển thị nút "Xem thêm gợi ý"
- [ ] "Xem thêm gợi ý" load batch mới, không trùng với batch trước

## "Surprise me"

- [ ] Nút "Surprise me" hiển thị rõ ràng trên Home screen
- [ ] Gợi ý món user chưa từng nấu/chọn trong 30 ngày qua
- [ ] Ưu tiên cuisine/vùng miền ít tương tác nhất
- [ ] Vẫn tuân thủ dietary restrictions và allergens
- [ ] Card hiển thị tag "Món mới" và lý do gợi ý ngắn gọn

## Combo bữa ăn

- [ ] Chế độ "Combo" gợi ý set 2-4 món bổ sung nhau
- [ ] Combo gồm tối thiểu: 1 món chính (protein) + 1 rau/salad
- [ ] Tổng calo combo trong khoảng ±15% target calo bữa ăn
- [ ] Hiển thị tổng calo, protein, carb, fat cho combo
- [ ] Có thể swap từng món trong combo
- [ ] Sau khi swap, calo tổng được tính lại

## Explainability

- [ ] Mỗi card có dòng giải thích lý do gợi ý (1 dòng, dễ hiểu)
- [ ] Tối thiểu 3 loại lý do: taste match, context match, diversity
- [ ] Lý do hiển thị bằng tiếng Việt tự nhiên

## Interaction Tracking

- [ ] Ghi lại action: view, skip, save, cook với timestamp
- [ ] Data gửi async, không block UI
- [ ] Batch gửi mỗi 30 giây hoặc khi có 10 events
- [ ] POST /interactions trả 202 Accepted
- [ ] Interaction history có thể query theo ngày và action type

## Rate Limiting

- [ ] Free tier: tối đa 50 request gợi ý/ngày
- [ ] Hiển thị số gợi ý còn lại cho Free tier
- [ ] Trả 429 khi vượt limit, kèm message rõ ràng
- [ ] Pro tier: unlimited

## Performance

- [ ] GET /suggestions response time < 500ms (bao gồm AI ranking)
- [ ] GET /suggestions/surprise response time < 300ms
- [ ] POST /interactions response time < 100ms
- [ ] Suggestion cards render < 200ms sau khi nhận data
