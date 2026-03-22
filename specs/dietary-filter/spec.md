# F5: Dietary Filter & Restrictions

## Tổng quan

Feature Dietary Filter & Restrictions cho phép người dùng quản lý chế độ ăn và các giới hạn dinh dưỡng (dị ứng, bệnh lý, tôn giáo, ingredient blacklist). Hệ thống sử dụng thông tin này để **tự động filter** mọi gợi ý món ăn, kết quả tìm kiếm, và meal plan — đảm bảo user không bao giờ thấy món ăn không phù hợp. Đây là hard filter (loại bỏ hoàn toàn), không phải soft preference.

## User Stories

### US-DF-01: Thiết lập chế độ ăn kiêng bệnh lý
**Là** Bác Hương (60 tuổi, bị tiểu đường type 2),
**Tôi muốn** khai báo tình trạng bệnh lý tiểu đường trong hồ sơ,
**Để** mọi gợi ý món ăn tự động loại bỏ món có đường cao, GI cao, và cảnh báo khi dinh dưỡng không phù hợp.

**Acceptance Criteria:**
- Chọn bệnh lý "Tiểu đường" từ danh sách conditions
- Sau khi lưu, tất cả gợi ý chỉ hiển thị món phù hợp tiểu đường
- Các món có lượng đường cao, chỉ số GI cao bị loại hoàn toàn
- Hiển thị badge "Phù hợp tiểu đường" trên card gợi ý

### US-DF-02: Filter dị ứng cho trẻ em
**Là** Chị Lan (mẹ có con 5 tuổi bị dị ứng hải sản và đậu phộng),
**Tôi muốn** khai báo các allergen cho profile con,
**Để** mọi gợi ý cho con (hoặc cả gia đình) không bao giờ chứa nguyên liệu gây dị ứng.

**Acceptance Criteria:**
- Chọn allergens: hải sản, đậu phộng từ danh sách
- Gợi ý cho profile con không chứa bất kỳ món nào có hải sản hoặc đậu phộng
- Khi mode "Cả gia đình", allergens của con được union vào filter chung
- Hiển thị cảnh báo rõ ràng nếu recipe chứa allergen

### US-DF-03: Chọn chế độ ăn chay
**Là** người dùng ăn chay theo Phật giáo,
**Tôi muốn** thiết lập chế độ ăn chay với tùy chọn theo ngày rằm/mùng 1,
**Để** nhận gợi ý chay vào đúng ngày và gợi ý bình thường vào ngày khác.

**Acceptance Criteria:**
- Chọn chế độ ăn chay Phật giáo (rằm/mùng 1) từ danh sách
- Vào ngày rằm và mùng 1 âm lịch, filter tự động chuyển sang chay
- Các ngày khác, gợi ý bình thường theo taste profile
- Hiển thị thông báo "Hôm nay ăn chay" vào ngày phù hợp

### US-DF-04: Tự thêm nguyên liệu không muốn ăn
**Là** người dùng,
**Tôi muốn** tự thêm nguyên liệu cụ thể vào blacklist (ví dụ: mắm tôm, nội tạng, rau mùi),
**Để** không bao giờ nhận gợi ý chứa nguyên liệu đó.

**Acceptance Criteria:**
- Trường nhập tự do (free text) để thêm ingredient vào blacklist
- Hỗ trợ autocomplete từ danh sách nguyên liệu trong hệ thống
- Có thể xóa ingredient khỏi blacklist bất kỳ lúc nào
- Blacklist áp dụng ngay lập tức cho mọi gợi ý

### US-DF-05: Chế độ ăn Halal
**Là** người dùng theo đạo Hồi,
**Tôi muốn** thiết lập chế độ ăn Halal,
**Để** chỉ nhận gợi ý món ăn tuân thủ quy tắc Halal (không thịt heo, không rượu).

**Acceptance Criteria:**
- Chọn "Halal" từ danh sách tôn giáo
- Filter loại bỏ: thịt heo, mỡ heo, rượu, bia, và các sản phẩm từ heo
- Filter áp dụng cho cả nguyên liệu phụ (nước mắm có chứa cồn, v.v.)

## Business Rules

1. **BR-DF-01:** Các chế độ ăn được hỗ trợ:
   - **Chay:** Lacto-vegetarian, Ovo-vegetarian, Lacto-ovo vegetarian, Vegan (thuần chay)
   - **Low-carb:** Keto (< 20g carb/ngày), Low-carb (< 100g carb/ngày)
   - **Khác:** Paleo, Mediterranean, DASH
   - MVP: chỉ hỗ trợ 1 chế độ ăn/profile. Phase 2: unlimited dietary filters

2. **BR-DF-02:** Các dị ứng thực phẩm (allergens) được hỗ trợ:
   - Hải sản (shellfish + fish)
   - Đậu phộng (peanuts)
   - Gluten (lúa mì, lúa mạch, yến mạch)
   - Sữa và sản phẩm từ sữa (dairy)
   - Trứng (eggs)
   - Đậu nành (soy)
   - Hạt cây (tree nuts: hạnh nhân, óc chó, hạt điều)
   - Có thể chọn nhiều allergen cùng lúc (multi-select)

3. **BR-DF-03:** Bệnh lý được hỗ trợ (Phase 2, master data sẵn từ MVP):
   - Tiểu đường (diabetes): filter món GI cao, đường cao
   - Huyết áp cao (hypertension): filter món nhiều muối, natri cao
   - Gout: filter món nhiều purine (nội tạng, hải sản đậm)
   - Bệnh thận (kidney disease): filter món nhiều kali, phospho, protein cao

4. **BR-DF-04:** Tôn giáo được hỗ trợ:
   - Ăn chay Phật giáo: rằm (ngày 15 âm lịch) và mùng 1 — auto switch sang chay
   - Halal: không thịt heo, không rượu/bia, giết mổ theo quy cách
   - Kosher: tách biệt meat/dairy, không shellfish, không thịt heo
   - Phase 2: hỗ trợ custom schedule ăn chay (ví dụ: thứ 2, thứ 6)

5. **BR-DF-05:** Ingredient blacklist:
   - User tự thêm nguyên liệu không muốn ăn (free text)
   - Tối đa 50 ingredients trong blacklist
   - Match dựa trên ingredient ID (normalize tên nguyên liệu)
   - Blacklist là hard filter — loại bỏ hoàn toàn recipe có chứa ingredient đó

6. **BR-DF-06:** Dietary filter là **hard filter** — áp dụng tự động cho:
   - Gợi ý món ăn (suggestion engine)
   - Tìm kiếm recipe (search)
   - Tạo meal plan
   - Combo suggestion
   - Không có ngoại lệ, không có "bỏ qua filter"

7. **BR-DF-07:** Thứ tự áp dụng filter:
   1. Diet type filter (loại bỏ theo chế độ ăn)
   2. Allergen filter (loại bỏ theo dị ứng)
   3. Medical condition filter (loại bỏ theo bệnh lý)
   4. Religious filter (loại bỏ theo tôn giáo/ngày)
   5. Ingredient blacklist filter (loại bỏ theo blacklist cá nhân)

8. **BR-DF-08:** Khi mode "Cả gia đình" (family merge):
   - Allergens: union tất cả thành viên
   - Diet type: áp dụng chế độ nghiêm ngặt nhất
   - Medical conditions: union tất cả
   - Ingredient blacklist: union tất cả

9. **BR-DF-09:** MVP scope:
   - Hỗ trợ 1 chế độ ăn + allergen filter + ingredient blacklist
   - Medical conditions: master data sẵn, filter logic Phase 2
   - Religious filter: master data sẵn, auto-schedule Phase 2
