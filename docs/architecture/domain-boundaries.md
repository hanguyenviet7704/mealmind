# Domain Boundaries

## API Service Modules

Mỗi module trong `services/api/src/modules/` là một bounded context:

### auth
- Registration, login, OAuth (Google, Apple)
- JWT token management
- Không chứa business logic

### users
- User profile CRUD
- Taste profile, dietary restrictions
- Family member management

### recipes
- Recipe CRUD (admin)
- Recipe browsing, search, detail (user)
- Ingredient management
- Bookmark/favorite

### meal-plans
- Meal plan generation (gọi recommendation service)
- Meal plan CRUD (create, update slots, lock/regenerate)
- Share meal plan

### nutrition
- Nutrition info per recipe
- Daily/weekly nutrition summary
- Nutrition goals

### dietary
- Dietary filter management
- Allergen filter
- Medical condition filter

## Recommendation Service (Python)

Tách biệt khỏi API, giao tiếp qua HTTP:
- `candidate-generation/` — tạo danh sách ứng viên
- `ranking/` — xếp hạng theo user preference
- `filters/` — lọc theo dietary/allergy
- `diversity/` — đảm bảo đa dạng, không lặp
- `explainability/` — giải thích "tại sao gợi ý món này"
