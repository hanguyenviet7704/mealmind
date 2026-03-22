# Recipe Data Specification

## Recipe Entity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | ✓ | Primary key |
| name | string | ✓ | Tên món (VD: "Phở bò Hà Nội") |
| slug | string | ✓ | URL slug |
| description | text | ✓ | Mô tả ngắn |
| cuisine | enum | ✓ | Vùng miền: bac, trung, nam, quoc_te |
| mealType | enum[] | ✓ | sang, trua, toi, phu |
| difficulty | enum | ✓ | de, trung_binh, kho |
| cookTime | int | ✓ | Phút nấu |
| prepTime | int | ✓ | Phút chuẩn bị |
| servings | int | ✓ | Số người ăn mặc định |
| imageUrl | string | | Ảnh món ăn |
| videoUrl | string | | Video hướng dẫn |
| tags | string[] | | VD: ["nhanh", "healthy", "comfort food"] |
| steps | Step[] | ✓ | Hướng dẫn nấu step-by-step |
| isPublished | bool | ✓ | Đã duyệt chưa |

## Ingredient Link

| Field | Type | Description |
|-------|------|-------------|
| recipeId | UUID | FK → recipes |
| ingredientId | UUID | FK → ingredients |
| quantity | decimal | Số lượng |
| unit | string | Đơn vị (gram, ml, muỗng, ...) |
| isOptional | bool | Có bắt buộc không |

## Data Sources

- Database có sẵn (cần audit format + quality)
- Crawl từ food blogs (cần xử lý copyright)
- User-generated content (Phase 2+)
- Food blogger partnerships

## Open Questions

- Format database có sẵn? Bao nhiêu món? Có nutrition info + ảnh?
- Copyright strategy cho crawled content?
