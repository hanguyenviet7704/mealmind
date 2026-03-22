# F6: Recipe Detail & Cooking Guide - Acceptance Criteria

## Recipe Browsing

- [ ] Trang danh sách recipes hiển thị dạng grid (web) / list (mobile) với ảnh, tên, thời gian nấu, calo
- [ ] Filter theo vùng miền: Bắc, Trung, Nam, Quốc tế
- [ ] Filter theo loại bữa: Sáng, Trưa, Tối, Bữa phụ
- [ ] Filter theo độ khó: Dễ, Vừa, Khó
- [ ] Filter theo thời gian nấu tối đa (phút)
- [ ] Sắp xếp theo: thời gian nấu, calo, mới nhất, phổ biến
- [ ] Pagination hoạt động đúng (page, pageSize, total, totalPages)
- [ ] Danh sách tự động áp dụng dietary filter của active profile
- [ ] Mỗi card hiển thị icon bookmark nếu đã lưu

## Full-text Search

- [ ] Thanh tìm kiếm full-text hỗ trợ tiếng Việt có dấu và không dấu
- [ ] Search "pho" và "phở" đều trả kết quả phở
- [ ] Typo tolerance: "pho bo" khớp "phở bò"
- [ ] Search theo tên món, mô tả, và tên nguyên liệu
- [ ] Kết quả search có thể kết hợp filter (cuisine, mealType, difficulty)
- [ ] Kết quả search tự động áp dụng dietary filter
- [ ] Hiển thị số kết quả và thời gian xử lý
- [ ] Kết quả rỗng hiển thị thông báo "Không tìm thấy món ăn phù hợp"

## Recipe Detail

- [ ] Hiển thị đầy đủ thông tin: tên, ảnh, mô tả, vùng miền, độ khó, thời gian (prep + cook), servings
- [ ] Hiển thị gallery ảnh (nếu có) với swipe/carousel
- [ ] Hiển thị danh sách nguyên liệu nhóm theo: chính, gia vị, phụ
- [ ] Mỗi nguyên liệu hiển thị: tên, số lượng, đơn vị, ghi chú
- [ ] Hiển thị thông tin dinh dưỡng: calo, protein, carb, fat (fiber, sodium nếu có)
- [ ] Hiển thị tags (Truyền thống, Nhanh gọn, Healthy, v.v.)

## Ingredient Scaling

- [ ] Có bộ chọn số người ăn (+/-) hoặc number picker (1-20)
- [ ] Mặc định hiển thị theo defaultServings của recipe
- [ ] Thay đổi servings → lượng nguyên liệu tự động scale
- [ ] Scaling formula: `quantity * (desiredServings / defaultServings)`
- [ ] Số lượng được làm tròn hợp lý:
  - Đơn vị liên tục (gram, ml): làm tròn đến hàng chục hoặc 0.5
  - Đơn vị nguyên (quả, con): làm tròn lên số nguyên gần nhất
- [ ] Thông tin dinh dưỡng scale theo servings
- [ ] URL cập nhật `?servings=N` khi thay đổi (shareable)

## Cooking Guide (Step-by-step)

- [ ] Hiển thị hướng dẫn nấu từng bước với số thứ tự
- [ ] Mỗi bước hiển thị: mô tả chi tiết, ảnh minh họa (nếu có)
- [ ] Hiển thị "Bước X/Y" cho biết tiến trình
- [ ] Có thể chuyển bước bằng nút Next/Previous hoặc swipe
- [ ] Bước hiện tại được highlight rõ ràng

## Timer tích hợp

- [ ] Bước có duration hiển thị nút timer với label (ví dụ: "Hầm 45 phút")
- [ ] Bấm nút timer bắt đầu đếm ngược
- [ ] Timer hiển thị floating ở góc màn hình, không che nội dung chính
- [ ] Timer có nút pause/resume và cancel
- [ ] Thông báo sound + vibration khi timer kết thúc
- [ ] Timer tiếp tục chạy khi navigate sang bước khác

## Bookmark/Favorite

- [ ] Nút bookmark hiển thị trên recipe card và trang chi tiết
- [ ] Bấm bookmark toggle on/off (filled/unfilled icon)
- [ ] POST /recipes/:id/bookmark trả 201 khi bookmark thành công
- [ ] POST /recipes/:id/bookmark trả 409 nếu đã bookmark
- [ ] DELETE /recipes/:id/bookmark trả 204 khi xóa bookmark
- [ ] Trang "Món yêu thích" (GET /recipes/bookmarks) hiển thị tất cả bookmark
- [ ] Bookmark list hỗ trợ pagination, search trong bookmark, filter theo cuisine/mealType
- [ ] Bookmark đồng bộ real-time giữa web và mobile

## API Validation

- [ ] GET /recipes trả 200 với danh sách recipes và meta pagination
- [ ] GET /recipes/:id trả 200 với đầy đủ detail (ingredients, steps, nutrition)
- [ ] GET /recipes/:id?servings=4 trả ingredients đã scale cho 4 người
- [ ] GET /recipes/:id trả 404 nếu recipe không tồn tại
- [ ] GET /recipes/search?q=pho trả 200 với kết quả search
- [ ] GET /recipes/search trả 400 nếu thiếu query param q
- [ ] GET /recipes/bookmarks trả 200 với danh sách bookmark của user
- [ ] Tất cả endpoints yêu cầu authentication (401 nếu không có token)

## Performance

- [ ] GET /recipes response time < 200ms (có cache)
- [ ] GET /recipes/:id response time < 150ms
- [ ] GET /recipes/search response time < 300ms (Meilisearch)
- [ ] Ingredient scaling tính toán client-side (không cần request thêm ngoài request đầu tiên)
- [ ] Ảnh recipe lazy loading, thumbnail cho list view
