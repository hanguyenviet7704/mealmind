# Database Schema Specification

## ERD Overview

```
┌─────────┐     ┌──────────────┐     ┌────────────────────┐
│  users   │────<│ taste_profiles│     │dietary_restrictions │
│          │     │              │     │                    │
│ id (PK)  │     │ id (PK)      │     │ id (PK)            │
│ email    │     │ user_id (FK) │     │ user_id (FK)       │
│ password │     │ profile_name │     │ profile_id (FK)    │
│ name     │     │ is_primary   │     │ diet_type          │
│ avatar   │     │ age_range    │     │ allergens[]        │
│ tier     │     │ regions[]    │     │ conditions[]       │
│          │     │ spice_level  │     │ religious_diet     │
│          │     │ sweet_level  │     │ blacklisted[]      │
│          │     │ salt_level   │     └────────────────────┘
│          │     │ diet_type    │
│          │     │ max_cook_time│
│          │     │ family_size  │
└────┬─────┘     └──────────────┘
     │
     │    ┌──────────────┐     ┌───────────────────┐
     ├───<│  meal_logs    │     │ user_interactions  │
     │    │              │     │                   │
     │    │ id (PK)      │     │ id (PK)           │
     │    │ user_id (FK) │     │ user_id (FK)      │
     │    │ recipe_id(FK)│     │ recipe_id (FK)    │
     │    │ profile_id   │     │ action (enum)     │
     │    │ meal_type    │     │ source (enum)     │
     │    │ date         │     │ context (jsonb)   │
     │    │ rating       │     │ created_at        │
     │    └──────────────┘     └───────────────────┘
     │
     │    ┌──────────────┐     ┌───────────────────┐
     ├───<│  meal_plans   │────<│ meal_plan_items    │
     │    │              │     │                   │
     │    │ id (PK)      │     │ id (PK)           │
     │    │ user_id (FK) │     │ plan_id (FK)      │
     │    │ week_start   │     │ day (1-7)         │
     │    │ status       │     │ meal_type (enum)  │
     │    │              │     │ recipe_id (FK)    │
     │    └──────────────┘     │ is_locked         │
     │                         └───────────────────┘
     │
     │    ┌──────────────────┐
     └───<│ meal_plan_shares  │
          │                  │
          │ id (PK)          │
          │ plan_id (FK)     │
          │ owner_id (FK)    │
          │ shared_with (FK) │
          │ permission       │
          └──────────────────┘


┌──────────┐     ┌───────────────────┐     ┌──────────────┐
│ recipes   │────<│ recipe_ingredients │────>│ ingredients   │
│           │     │                   │     │              │
│ id (PK)   │     │ id (PK)           │     │ id (PK)      │
│ name      │     │ recipe_id (FK)    │     │ name         │
│ slug      │     │ ingredient_id(FK) │     │ name_ascii   │
│ desc      │     │ quantity          │     │ category     │
│ cuisine   │     │ unit              │     │ season[]     │
│ meal_types│     │ group             │     │ avg_price    │
│ difficulty│     │ is_optional       │     │ allergen_tags│
│ cook_time │     └───────────────────┘     └──────────────┘
│ prep_time │
│ servings  │     ┌───────────────────┐
│ image_url │────<│ recipe_steps       │
│ video_url │     │                   │
│ tags[]    │     │ id (PK)           │
│ is_publish│     │ recipe_id (FK)    │
│           │     │ step_number       │
│           │────<│ description       │
│           │     │ image_url         │
│           │     │ duration_minutes  │
│           │     └───────────────────┘
│           │
│           │     ┌───────────────────┐
│           │────<│ nutrition_info     │
│           │     │                   │
│           │     │ recipe_id (PK,FK) │
│           │     │ calories          │
│           │     │ protein           │
│           │     │ carbs             │
│           │     │ fat               │
│           │     │ fiber             │
│           │     │ sodium            │
│           │     │ sugar             │
│           │     └───────────────────┘
│           │
│           │     ┌───────────────────┐
│           │────<│ bookmarks          │
│           │     │                   │
│           │     │ user_id (FK,PK)   │
│           │     │ recipe_id (FK,PK) │
│           │     │ created_at        │
│           │     └───────────────────┘
└───────────┘

┌────────────────┐
│ refresh_tokens  │
│                │
│ id (PK)        │
│ user_id (FK)   │
│ token_hash     │
│ expires_at     │
│ created_at     │
│ revoked_at     │
└────────────────┘

┌──────────────────┐
│ ingredient_nutrients│
│                    │
│ ingredient_id(PK,FK)│
│ calories_per_100g  │
│ protein_per_100g   │
│ carbs_per_100g     │
│ fat_per_100g       │
│ fiber_per_100g     │
│ sodium_per_100g    │
│ source             │
└──────────────────┘
```

## Table Details

### users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK, DEFAULT gen_random_uuid() | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hash |
| name | VARCHAR(100) | NOT NULL | Display name |
| avatar_url | TEXT | | |
| subscription_tier | ENUM | NOT NULL, DEFAULT 'free' | free, pro |
| active_profile_id | VARCHAR(255) | FK → taste_profiles.id, NULLABLE | null = family mode |
| onboarding_completed | BOOLEAN | DEFAULT false | |
| created_at | DATETIME | DEFAULT NOW() | |
| updated_at | DATETIME | DEFAULT NOW() | |

**Indexes:**
- `UNIQUE (email)`
- `INDEX (subscription_tier)`

### taste_profiles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| user_id | VARCHAR(255) | FK → users.id, NOT NULL | |
| profile_name | VARCHAR(50) | NOT NULL | "Mẹ Lan", "Con Bảo" |
| is_primary | BOOLEAN | DEFAULT false | Profile chính = chủ tài khoản |
| age_range | ENUM | | child_under_6, child_6_12, teen, adult, senior |
| regions | JSON | DEFAULT '{}' | [north, central, south, international] |
| spice_level | SMALLINT | DEFAULT 3, CHECK(1-5) | |
| sweet_level | SMALLINT | DEFAULT 3, CHECK(1-5) | |
| salt_level | SMALLINT | DEFAULT 3, CHECK(1-5) | |
| diet_type | ENUM | DEFAULT 'normal' | normal, lacto_ovo_vegetarian, vegan, keto, low_carb, paleo |
| max_cook_time | ENUM | DEFAULT '30_to_60' | under_15, 15_to_30, 30_to_60, over_60 |
| family_size | SMALLINT | DEFAULT 2, CHECK(1-20) | |
| created_at | DATETIME | | |
| updated_at | DATETIME | | |

**Indexes:**
- `INDEX (user_id)`
- `UNIQUE (user_id, is_primary) WHERE is_primary = true` — mỗi user chỉ 1 primary

**Constraints:**
- Tối đa 6 profiles/user (Free), 10 profiles/user (Pro) — enforce ở application layer

### dietary_restrictions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| user_id | VARCHAR(255) | FK → users.id, NOT NULL | |
| profile_id | VARCHAR(255) | FK → taste_profiles.id, NOT NULL | |
| diet_type | ENUM | | Duplicate từ taste_profiles để query nhanh |
| allergens | JSON | DEFAULT '{}' | [shellfish, peanuts, gluten, dairy, eggs, soy, tree_nuts] |
| medical_conditions | JSON | DEFAULT '{}' | [diabetes, hypertension, gout, kidney] |
| religious_diet | ENUM | | none, buddhist_lunar, halal, kosher |
| blacklisted_ingredients | VARCHAR(255)[] | DEFAULT '{}' | FK → ingredients.id |
| custom_blacklist | JSON | DEFAULT '{}' | Free text cho ingredients chưa có trong master |
| created_at | DATETIME | | |
| updated_at | DATETIME | | |

**Indexes:**
- `INDEX (user_id)`
- `INDEX (profile_id)`

### recipes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| name | VARCHAR(200) | NOT NULL | Tên tiếng Việt |
| name_ascii | VARCHAR(200) | NOT NULL | Tên không dấu (cho search) |
| slug | VARCHAR(250) | UNIQUE, NOT NULL | URL-friendly |
| description | TEXT | NOT NULL | |
| cuisine | ENUM | NOT NULL | north, central, south, international |
| meal_types | JSON | NOT NULL | [breakfast, lunch, dinner, snack] |
| difficulty | ENUM | NOT NULL | easy, medium, hard |
| cook_time | SMALLINT | NOT NULL | Phút |
| prep_time | SMALLINT | NOT NULL | Phút |
| servings | SMALLINT | NOT NULL, DEFAULT 2 | Số người ăn mặc định |
| image_url | TEXT | | |
| video_url | TEXT | | |
| tags | JSON | DEFAULT '{}' | [nhanh, healthy, comfort_food, ...] |
| is_published | BOOLEAN | DEFAULT false | |
| popularity_score | FLOAT | DEFAULT 0 | Tính từ interactions |
| created_at | DATETIME | | |
| updated_at | DATETIME | | |

**Indexes:**
- `UNIQUE (slug)`
- `INDEX (cuisine)`
- `INDEX (difficulty)`
- `INDEX (cook_time)`
- `INDEX (is_published)`
- `GIN INDEX (meal_types)` — array contains
- `GIN INDEX (tags)` — array contains
- `INDEX (popularity_score DESC)` — cho popularity fallback

### recipe_ingredients

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| recipe_id | VARCHAR(255) | FK → recipes.id, NOT NULL, ON DELETE CASCADE | |
| ingredient_id | VARCHAR(255) | FK → ingredients.id, NOT NULL | |
| quantity | DECIMAL(10,2) | NOT NULL | |
| unit | VARCHAR(30) | NOT NULL | gram, ml, tbsp, tsp, quả, lát, con, nắm... |
| group_type | ENUM | DEFAULT 'main' | main, seasoning, garnish |
| is_optional | BOOLEAN | DEFAULT false | |
| sort_order | SMALLINT | DEFAULT 0 | Thứ tự hiển thị |

**Indexes:**
- `INDEX (recipe_id)`
- `INDEX (ingredient_id)`
- `UNIQUE (recipe_id, ingredient_id)` — không duplicate

### ingredients

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Tên tiếng Việt |
| name_ascii | VARCHAR(100) | NOT NULL | Không dấu |
| category | ENUM | NOT NULL | protein, vegetable, fruit, grain, dairy, seasoning, oil, other |
| season | JSON | DEFAULT '{}' | [spring, summer, autumn, winter] — empty = quanh năm |
| avg_price_per_kg | DECIMAL(10,0) | | VND |
| allergen_tags | JSON | DEFAULT '{}' | [shellfish, peanuts, gluten, dairy, eggs, soy, tree_nuts] |
| is_common | BOOLEAN | DEFAULT true | Nguyên liệu phổ biến |
| created_at | DATETIME | | |

**Indexes:**
- `UNIQUE (name)`
- `INDEX (category)`
- `GIN INDEX (allergen_tags)`

### ingredient_nutrients

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ingredient_id | VARCHAR(255) | PK, FK → ingredients.id | |
| calories_per_100g | DECIMAL(8,2) | | kcal |
| protein_per_100g | DECIMAL(8,2) | | gram |
| carbs_per_100g | DECIMAL(8,2) | | gram |
| fat_per_100g | DECIMAL(8,2) | | gram |
| fiber_per_100g | DECIMAL(8,2) | | gram |
| sodium_per_100g | DECIMAL(8,2) | | mg |
| sugar_per_100g | DECIMAL(8,2) | | gram |
| glycemic_index | SMALLINT | | 0-100, cho diabetes filter |
| purine_level | ENUM | | low, medium, high — cho gout filter |
| source | VARCHAR(50) | | USDA, VNIN (Viện Dinh dưỡng VN) |

### nutrition_info

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| recipe_id | VARCHAR(255) | PK, FK → recipes.id, ON DELETE CASCADE | |
| calories | DECIMAL(8,1) | NOT NULL | kcal per serving |
| protein | DECIMAL(8,1) | NOT NULL | gram |
| carbs | DECIMAL(8,1) | NOT NULL | gram |
| fat | DECIMAL(8,1) | NOT NULL | gram |
| fiber | DECIMAL(8,1) | | gram |
| sodium | DECIMAL(8,1) | | mg |
| sugar | DECIMAL(8,1) | | gram |
| is_manual | BOOLEAN | DEFAULT false | Admin override vs calculated |
| calculated_at | DATETIME | | Lần cuối tính toán tự động |

### recipe_steps

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| recipe_id | VARCHAR(255) | FK → recipes.id, ON DELETE CASCADE | |
| step_number | SMALLINT | NOT NULL | 1-based |
| description | TEXT | NOT NULL | |
| image_url | TEXT | | |
| duration_minutes | SMALLINT | | Nếu có → hiển thị timer |

**Indexes:**
- `INDEX (recipe_id)`
- `UNIQUE (recipe_id, step_number)`

### meal_logs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| user_id | VARCHAR(255) | FK → users.id, NOT NULL | |
| profile_id | VARCHAR(255) | FK → taste_profiles.id | |
| recipe_id | VARCHAR(255) | FK → recipes.id, NOT NULL | |
| meal_type | ENUM | NOT NULL | breakfast, lunch, dinner, snack |
| date | DATE | NOT NULL | |
| rating | SMALLINT | CHECK(1-5) | |
| notes | TEXT | | |
| created_at | DATETIME | | |

**Indexes:**
- `INDEX (user_id, date DESC)`
- `INDEX (recipe_id)`

### user_interactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| user_id | VARCHAR(255) | FK → users.id, NOT NULL | |
| recipe_id | VARCHAR(255) | FK → recipes.id, NOT NULL | |
| action | ENUM | NOT NULL | view, skip, save, cook |
| source | ENUM | | home, search, combo, surprise, meal_plan |
| context | JSON | | { mealType, weather, dayOfWeek } |
| dwell_time_ms | INTEGER | | Thời gian xem recipe (ms) |
| created_at | DATETIME | DEFAULT NOW() | |

**Indexes:**
- `INDEX (user_id, created_at DESC)`
- `INDEX (recipe_id)`
- `INDEX (action)`
- Partition by month nếu volume lớn

### meal_plans

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| user_id | VARCHAR(255) | FK → users.id, NOT NULL | |
| week_start | DATE | NOT NULL | Thứ 2 đầu tuần |
| status | ENUM | NOT NULL, DEFAULT 'draft' | draft, active, archived |
| created_at | DATETIME | | |
| updated_at | DATETIME | | |

**Indexes:**
- `INDEX (user_id, status)`
- `INDEX (user_id, week_start)`
- `UNIQUE (user_id, status) WHERE status = 'active'` — chỉ 1 plan active/user

### meal_plan_items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| plan_id | VARCHAR(255) | FK → meal_plans.id, ON DELETE CASCADE | |
| day | SMALLINT | NOT NULL, CHECK(1-7) | 1=Thứ 2, 7=Chủ nhật |
| meal_type | ENUM | NOT NULL | breakfast, lunch, dinner, snack |
| recipe_id | VARCHAR(255) | FK → recipes.id, NOT NULL | |
| is_locked | BOOLEAN | DEFAULT false | |
| sort_order | SMALLINT | DEFAULT 0 | |

**Indexes:**
- `INDEX (plan_id)`
- `UNIQUE (plan_id, day, meal_type, sort_order)` — không duplicate slot

### meal_plan_shares

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| plan_id | VARCHAR(255) | FK → meal_plans.id, ON DELETE CASCADE | |
| owner_id | VARCHAR(255) | FK → users.id, NOT NULL | |
| shared_with_id | VARCHAR(255) | FK → users.id, NOT NULL | |
| permission | ENUM | DEFAULT 'viewer' | viewer, editor |
| created_at | DATETIME | | |

**Indexes:**
- `UNIQUE (plan_id, shared_with_id)`

### bookmarks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | VARCHAR(255) | FK → users.id, NOT NULL | |
| recipe_id | VARCHAR(255) | FK → recipes.id, NOT NULL | |
| created_at | DATETIME | DEFAULT NOW() | |

**PK:** (user_id, recipe_id)

### nutrition_goals

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| user_id | VARCHAR(255) | FK → users.id, NOT NULL | |
| profile_id | VARCHAR(255) | FK → taste_profiles.id, NOT NULL | |
| preset | ENUM | NOT NULL, DEFAULT 'maintain' | maintain, weight_loss, muscle_gain, diabetic, custom |
| daily_calories | INT | DEFAULT 2000 | kcal |
| daily_protein_grams | DECIMAL(8,1) | DEFAULT 50 | gram |
| daily_carb_grams | DECIMAL(8,1) | DEFAULT 275 | gram |
| daily_fat_grams | DECIMAL(8,1) | DEFAULT 65 | gram |
| daily_fiber_grams | DECIMAL(8,1) | DEFAULT 25 | gram |
| created_at | DATETIME | | |
| updated_at | DATETIME | | |

**Indexes:**
- `UNIQUE (user_id, profile_id)` — 1 goal set per profile
- `INDEX (user_id)`

### refresh_tokens

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PK | |
| user_id | VARCHAR(255) | FK → users.id, NOT NULL | |
| token_hash | VARCHAR(255) | NOT NULL | SHA-256 of token |
| device_info | VARCHAR(255) | | "iPhone 15", "Chrome/Windows" |
| expires_at | DATETIME | NOT NULL | |
| created_at | DATETIME | | |
| revoked_at | DATETIME | | null = active |

**Indexes:**
- `INDEX (user_id)`
- `INDEX (token_hash)`
- `INDEX (expires_at)` — cleanup job

## MySQL Note on Enums

MySQL 8.0 natively supports ENUM types. Prisma handles them by defining them in the schema.prisma file.

## Migration Strategy

- Dùng Prisma Migrate
- Mỗi migration đặt tên rõ ràng: `20260321_init_schema`, `20260325_add_bookmarks`
- KHÔNG sửa migration đã chạy — tạo migration mới
- Seed data chạy riêng qua `scripts/seed.ts`
- Indexes thêm trong migration, không thêm sau

## Notes

- Tất cả timestamp dùng DATETIME (timezone-aware)
- VARCHAR(255) v4 cho tất cả primary keys
- Soft delete KHÔNG dùng — hard delete + cascade
- JSON chỉ dùng cho `user_interactions.context` (schema-less by design)
- Arrays (JSON) dùng cho allergens, tags, regions — query bằng `@>` operator
