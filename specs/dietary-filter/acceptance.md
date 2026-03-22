# F5: Dietary Filter & Restrictions - Acceptance Criteria

## Dietary Settings CRUD

- [ ] User có thể xem dietary restrictions hiện tại từ Settings > Chế độ ăn
- [ ] User có thể chọn 1 chế độ ăn (diet type) từ danh sách: Bình thường, Chay lacto, Chay ovo, Chay lacto-ovo, Thuần chay, Keto, Low-carb, Paleo, Mediterranean, DASH
- [ ] User có thể chọn nhiều allergens cùng lúc (multi-select chip): hải sản, đậu phộng, gluten, sữa, trứng, đậu nành, hạt cây
- [ ] User có thể chọn bệnh lý (multi-select): tiểu đường, huyết áp cao, gout, thận
- [ ] User có thể chọn chế độ ăn tôn giáo: Phật giáo (rằm/mùng 1), Halal, Kosher
- [ ] User có thể thêm nguyên liệu vào ingredient blacklist (free text + autocomplete)
- [ ] Ingredient blacklist tối đa 50 items, hiển thị lỗi khi vượt quá
- [ ] User có thể xóa ingredient khỏi blacklist
- [ ] Thay đổi dietary restrictions được lưu ngay khi nhấn Save
- [ ] Hiển thị thông báo "Đã cập nhật chế độ ăn" sau khi lưu thành công
- [ ] Thay đổi có hiệu lực ngay lập tức cho mọi gợi ý tiếp theo

## Dietary Options Master Data

- [ ] GET /dietary/options trả về danh sách đầy đủ diet types, allergens, medical conditions, religious diets
- [ ] Mỗi option có: key, label (tiếng Việt), description, icon
- [ ] Mỗi option có trường phase (mvp/phase2) để UI biết enable/disable
- [ ] Medical conditions hiển thị nhưng ghi chú "Sắp ra mắt" (Phase 2)

## Filter trong Recommendation Engine

- [ ] Tất cả gợi ý món ăn (GET /suggestions) tuân thủ dietary restrictions của active profile
- [ ] Món chứa allergen bị loại hoàn toàn (hard filter), không hiển thị
- [ ] Món không phù hợp chế độ ăn bị loại hoàn toàn
- [ ] Ingredient blacklist loại bỏ recipe chứa nguyên liệu bị blacklist
- [ ] "Surprise me" vẫn tuân thủ toàn bộ dietary filter
- [ ] Combo suggestion tuân thủ dietary filter cho tất cả món trong combo
- [ ] Filter áp dụng theo thứ tự: diet type > allergen > medical > religious > blacklist

## Filter trong Recipe Search

- [ ] Tìm kiếm recipe (GET /recipes/search) tự động áp dụng dietary filter
- [ ] Kết quả search không chứa recipe vi phạm bất kỳ dietary restriction nào
- [ ] Recipe list (GET /recipes) cũng áp dụng dietary filter
- [ ] Nếu user không có dietary restrictions, search trả tất cả kết quả bình thường

## Family Mode Filter

- [ ] Khi mode "Cả gia đình", allergens được union từ tất cả thành viên
- [ ] Khi mode "Cả gia đình", diet type áp dụng chế độ nghiêm ngặt nhất
- [ ] Khi mode "Cả gia đình", medical conditions được union
- [ ] Khi mode "Cả gia đình", ingredient blacklist được union
- [ ] Chuyển đổi giữa individual/family mode cập nhật filter ngay lập tức

## API Validation

- [ ] GET /users/:id/dietary trả 200 với dietary restrictions hiện tại
- [ ] GET /users/:id/dietary trả 404 nếu user không tồn tại
- [ ] PUT /users/:id/dietary trả 200 khi update thành công
- [ ] PUT /users/:id/dietary trả 400 khi dietType không hợp lệ
- [ ] PUT /users/:id/dietary trả 400 khi allergen không nằm trong danh sách cho phép
- [ ] PUT /users/:id/dietary trả 400 khi ingredientBlacklist vượt quá 50 items
- [ ] PUT /users/:id/dietary trả 403 khi update dietary của user khác
- [ ] GET /dietary/options trả 200 với danh sách đầy đủ options
- [ ] Tất cả endpoints yêu cầu authentication (401 nếu không có token)

## Performance

- [ ] GET /users/:id/dietary response time < 100ms
- [ ] PUT /users/:id/dietary response time < 200ms
- [ ] GET /dietary/options response time < 100ms (có thể cache)
- [ ] Dietary filter không làm tăng response time của GET /suggestions quá 50ms
