# Nutrition Data Specification

## Per Recipe

| Field | Type | Unit | Source |
|-------|------|------|--------|
| calories | decimal | kcal | Tính từ ingredients |
| protein | decimal | gram | |
| carbs | decimal | gram | |
| fat | decimal | gram | |
| fiber | decimal | gram | |
| sodium | decimal | mg | |
| sugar | decimal | gram | Phase 2 |
| cholesterol | decimal | mg | Phase 2 |

## Data Sources

- USDA FoodData Central (international ingredients)
- Viện Dinh dưỡng Quốc gia Việt Nam (Vietnamese ingredients)
- Tính toán từ ingredient quantities × nutrition per 100g

## Accuracy Policy

- Nutrition info là ước tính, hiển thị disclaimer
- Cho phép user report sai số
- Admin có thể override manual
