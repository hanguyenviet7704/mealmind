# Recommendation Service Specification

Python service chạy tách biệt, giao tiếp với NestJS API qua HTTP.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | FastAPI |
| ML | scikit-learn (v1), TensorFlow (v2) |
| Data | pandas, numpy |
| Server | uvicorn |
| Config | pydantic-settings |
| Test | pytest |

## Project Structure

```
services/recommendation/
├── src/
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Settings (DB url, model paths)
│   ├── api/
│   │   ├── routes.py            # HTTP endpoints (/recommend, /feedback, /health)
│   │   └── schemas.py           # Pydantic request/response models
│   ├── candidate_generation/
│   │   ├── content_based.py     # Content-based scoring
│   │   └── popularity.py        # Popularity fallback
│   ├── ranking/
│   │   └── ranker.py            # Score aggregation + sorting
│   ├── filters/
│   │   ├── dietary_filter.py    # Diet type, allergens, medical
│   │   ├── history_filter.py    # Exclude recent meals
│   │   └── blacklist_filter.py  # Ingredient blacklist
│   ├── diversity/
│   │   └── controller.py        # Prevent repetition, ensure variety
│   ├── context/
│   │   └── engine.py            # Weather, time, season bias
│   ├── explainability/
│   │   └── explainer.py         # Generate reason strings
│   └── utils/
│       ├── db.py                # PostgreSQL read-only access
│       └── cache.py             # Redis cache
├── models/                      # Saved model files (.pkl, .joblib)
├── tests/
│   ├── test_content_based.py
│   ├── test_filters.py
│   ├── test_diversity.py
│   └── test_api.py
├── requirements.txt
├── Dockerfile
└── README.md
```

## Pipeline v1 (MVP)

```
Input: {userId, profileId, mealType, context, filters, excludeIds, mode}
  │
  ▼
┌──────────────────────────┐
│ 1. CANDIDATE GENERATION  │
│                          │
│ Lấy TẤT CẢ published    │
│ recipes matching mealType │
│ (từ DB, cache in Redis)  │
│                          │
│ Output: ~all recipes     │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 2. HARD FILTER           │
│                          │
│ a. Dietary filter        │
│    (diet_type rules)     │
│ b. Allergen filter       │
│    (check ingredient     │
│     allergen_tags)       │
│ c. Blacklist filter      │
│    (user's blacklisted   │
│     ingredients)         │
│ d. History filter        │
│    (exclude last 2 days) │
│                          │
│ Output: ~60-80% recipes  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 3. SCORING               │
│                          │
│ a. Content-based score   │
│    (taste profile match) │
│    - cuisine match: +0.3 │
│    - cook time match: +0.2│
│    - difficulty match: +0.1│
│    - spice/sweet/salt    │
│      proximity: +0.2    │
│                          │
│ b. Popularity score      │
│    - normalized 0-1      │
│    - from interaction    │
│      counts              │
│                          │
│ c. Context score         │
│    - weather match: +0.15│
│    - weekend bonus: +0.1 │
│    - season match: +0.1  │
│                          │
│ d. Final score =         │
│    0.5 × content +       │
│    0.2 × popularity +    │
│    0.2 × context +       │
│    0.1 × random          │
│    (random = exploration)│
│                          │
│ Cold start override:     │
│    0.2 × content +       │
│    0.5 × popularity +    │
│    0.0 × context +       │
│    0.3 × random          │
│                          │
│ Output: scored list      │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 4. DIVERSITY CHECK       │
│                          │
│ From top 20 scored:      │
│ - Max 2 from same cuisine│
│ - Max 1 from same protein│
│   type (chicken/beef/...)│
│ - Spread cook time       │
│   (mix nhanh + lâu)     │
│                          │
│ Output: 5 diverse picks  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 5. EXPLAINABILITY        │
│                          │
│ For each pick, generate  │
│ reason string:           │
│ - taste_match: "Phù hợp │
│   khẩu vị miền Bắc"     │
│ - context_match: "Trời   │
│   lạnh, thử canh nóng"  │
│ - diversity: "Thử món    │
│   miền Trung nhé!"      │
│ - popular: "Món được yêu │
│   thích nhất tuần này"   │
│                          │
│ Output: [{recipeId,      │
│   score, reason,         │
│   reasonType}]           │
└──────────────────────────┘
```

## Content-Based Scoring Detail

### Taste Profile Match

```python
def score_taste_match(recipe, profile) -> float:
    score = 0.0

    # Cuisine match (0 or 0.3)
    if recipe.cuisine in profile.regions:
        score += 0.3

    # Cook time match (0 or 0.2)
    if recipe.cook_time <= cook_time_max(profile.max_cook_time):
        score += 0.2

    # Difficulty preference (0-0.1)
    # Trẻ em / người cao tuổi → ưu tiên easy
    if profile.age_range in ['child_under_6', 'child_6_12', 'senior']:
        if recipe.difficulty == 'easy':
            score += 0.1

    # Spice proximity (0-0.2)
    # recipe.spice_level estimated from ingredients
    spice_diff = abs(recipe.estimated_spice - profile.spice_level) / 4
    score += 0.2 * (1 - spice_diff)

    return score  # 0.0 - 0.8
```

### Popularity Score

```python
def score_popularity(recipe) -> float:
    # Normalized 0-1 based on interaction counts in last 30 days
    # cook > save > view > skip (weighted)
    raw = (recipe.cook_count * 1.0
         + recipe.save_count * 0.5
         + recipe.view_count * 0.1
         - recipe.skip_count * 0.3)
    return normalize_min_max(raw)  # 0.0 - 1.0
```

## Meal Plan Generation Logic

```python
def generate_meal_plan(request) -> list[Slot]:
    slots = []
    used_recipes = set()
    used_proteins_per_window = []  # track 3-day window

    for day in range(1, 8):
        day_calories = 0

        for meal_type in ['breakfast', 'lunch', 'dinner']:
            # Target calories for this meal
            meal_calorie_target = calorie_split(request.nutrition_target, meal_type)
            # breakfast=25%, lunch=40%, dinner=35%

            candidates = get_candidates(
                meal_type=meal_type,
                filters=request.filters,
                exclude=used_recipes,
            )

            scored = score_all(candidates, request.profile, context_for_day(day))

            # Diversity: avoid same protein 3 days in a row
            scored = penalize_repeat_protein(scored, used_proteins_per_window)

            # Nutrition: prefer recipes close to meal calorie target
            scored = boost_calorie_match(scored, meal_calorie_target)

            best = scored[0]
            slots.append(Slot(day=day, mealType=meal_type, recipeId=best.id))
            used_recipes.add(best.id)
            day_calories += best.calories

    return slots
```

## Surprise Mode

```python
def surprise_suggest(request) -> Suggestion:
    # Lấy recipes user chưa cook trong 30 ngày
    never_cooked = get_never_cooked_recipes(request.user_id, days=30)

    # Ưu tiên cuisine user ít tương tác nhất
    least_explored_cuisine = get_least_explored_cuisine(request.user_id)

    candidates = [r for r in never_cooked if r.cuisine == least_explored_cuisine]

    if not candidates:
        candidates = never_cooked

    # Apply filters (dietary, allergens)
    candidates = apply_hard_filters(candidates, request.filters)

    # Random pick
    return random.choice(candidates)
```

## Data Access

- **Read-only** MySQL connection (same DB as NestJS)
- Cache recipe list in Redis (TTL 5 min)
- Cache user profile in Redis (TTL 1 min)
- NO writes to main DB — chỉ nhận interaction data qua /feedback endpoint

## Health Check

```
GET /health
→ {
    "status": "ok",
    "modelVersion": "v1.0.0",
    "recipesLoaded": 500,
    "uptime": 3600
  }
```

## Performance Targets

| Metric | Target |
|--------|--------|
| /recommend latency | < 500ms (p95) |
| /recommend/meal-plan latency | < 3s (p95) |
| /feedback throughput | > 100 req/s |
| Cold start time | < 10s |
| Memory usage | < 512MB |
