# Seed Data Strategy

## MVP Seed Targets

| Data | Số lượng tối thiểu | Nguồn |
|------|-------------------|-------|
| Recipes | 500 món | Database có sẵn + curated |
| Ingredients | 300 nguyên liệu | Master list |
| Nutrition info | 500 recipes | Tính từ ingredients |
| Categories | ~15 cuisine types | Manual |

## Seed File Format

`data/seeds/` chứa JSON files:
- `recipes.json` — danh sách recipes
- `ingredients.json` — master ingredient list
- `nutrition.json` — nutrition per ingredient (per 100g)
- `categories.json` — cuisine + meal type enums

## Seed Script

`scripts/seed.ts`:
1. Clear existing data (dev only)
2. Import ingredients
3. Import recipes + link ingredients
4. Calculate nutrition per recipe
5. Index recipes vào Meilisearch
