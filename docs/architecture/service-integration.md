# Service Integration Spec

Cách các services giao tiếp với nhau trong hệ thống MealMind.

## Overview

```
┌──────────┐    HTTP/JSON     ┌──────────────────┐
│ API      │ ───────────────> │ Recommendation   │
│ (NestJS) │ <─────────────── │ Service (Python) │
└────┬─────┘                  └──────────────────┘
     │
     │ Redis pub/sub
     ▼
┌──────────┐
│ Workers  │
│ (Node.js)│
└──────────┘
```

## API ↔ Recommendation Service

### Protocol
- HTTP REST (JSON)
- Base URL: `RECOMMENDATION_SERVICE_URL` (env var, default `http://localhost:8000`)
- Timeout: 10 giây
- Retry: 1 lần (exponential backoff 2s)
- Fallback: popularity-based nếu recommendation service down

### Internal Endpoints (recommendation service)

#### POST /recommend

Gợi ý món ăn cho user.

**Request:**
```json
{
  "userId": "uuid",
  "profileId": "uuid",
  "mealType": "lunch",
  "count": 5,
  "context": {
    "weather": { "temperature": 28, "condition": "warm" },
    "dayOfWeek": "monday",
    "isWeekend": false,
    "season": "summer",
    "timeOfDay": "11:30"
  },
  "filters": {
    "dietType": "normal",
    "allergens": ["peanuts"],
    "blacklistedIngredientIds": ["uuid1", "uuid2"],
    "maxCookTime": 60
  },
  "excludeRecipeIds": ["uuid-recently-eaten-1", "uuid-recently-eaten-2"],
  "mode": "standard"
}
```

`mode` values:
- `standard` — gợi ý bình thường
- `surprise` — ưu tiên món mới, cuisine khác lạ
- `combo` — trả về set 2-4 món bổ sung nhau

**Response:**
```json
{
  "suggestions": [
    {
      "recipeId": "uuid",
      "score": 0.87,
      "reasonType": "taste_match",
      "reason": "Phù hợp khẩu vị miền Bắc",
      "model": "content_based_v1"
    }
  ],
  "metadata": {
    "modelVersion": "v1.0.3",
    "latencyMs": 120,
    "candidateCount": 450,
    "filteredCount": 380
  }
}
```

#### POST /recommend/meal-plan

Generate thực đơn tuần.

**Request:**
```json
{
  "userId": "uuid",
  "profileId": "uuid",
  "weekStart": "2026-03-23",
  "lockedSlots": [
    { "day": 1, "mealType": "breakfast", "recipeId": "uuid" }
  ],
  "filters": { ... },
  "nutritionTarget": {
    "caloriesPerDay": 2000,
    "proteinPerDay": 120,
    "carbsPerDay": 250,
    "fatPerDay": 65
  }
}
```

**Response:**
```json
{
  "slots": [
    {
      "day": 1,
      "mealType": "breakfast",
      "recipeId": "uuid",
      "isLocked": true,
      "score": 0.92
    },
    {
      "day": 1,
      "mealType": "lunch",
      "recipeId": "uuid",
      "isLocked": false,
      "score": 0.85
    }
  ],
  "nutritionSummary": {
    "days": [
      { "day": 1, "calories": 1950, "protein": 115, "carbs": 240, "fat": 62 }
    ]
  },
  "metadata": {
    "modelVersion": "v1.0.3",
    "latencyMs": 850
  }
}
```

#### POST /feedback

Nhận interaction data để cập nhật model (batch).

**Request:**
```json
{
  "interactions": [
    {
      "userId": "uuid",
      "recipeId": "uuid",
      "action": "cook",
      "context": { "mealType": "lunch", "source": "home" },
      "timestamp": "2026-03-21T12:30:00Z"
    }
  ]
}
```

**Response:** `202 Accepted`

### Health Check

```
GET /health → { "status": "ok", "modelVersion": "v1.0.3" }
```

API service check health on startup + every 30s. Nếu unhealthy → log warning + fallback sang popularity.

---

## API → Workers (Redis Pub/Sub)

### Events Published by API

| Channel | Event | Payload | Consumer |
|---------|-------|---------|----------|
| `user.registered` | User mới đăng ký | { userId, email, name } | Workers: welcome email |
| `interaction.batch` | Batch interactions | { interactions[] } | Workers: forward to recommendation /feedback |
| `meal_plan.created` | Meal plan mới | { userId, planId } | Workers: notification |
| `recipe.bookmarked` | Bookmark recipe | { userId, recipeId } | Workers: analytics |

### Workers → API

Workers không gọi ngược API. Nếu cần update DB, workers truy cập DB trực tiếp (same Prisma client).

---

## External Service Integration

### Weather API

- Provider: OpenWeatherMap (free tier 1000 calls/day)
- Endpoint: `GET /data/2.5/weather?lat={lat}&lon={lon}&appid={key}&units=metric`
- Cache: Redis, TTL 30 phút
- Fallback: nếu API fail → bỏ weather context, gợi ý không có weather bias

### Meilisearch

- Chạy local (Docker) hoặc cloud
- Index: `recipes` — sync từ PostgreSQL khi recipe create/update/delete
- Sync strategy: API service gọi Meilisearch client trực tiếp sau DB write
- Searchable: name, name_ascii, description, ingredient names
- Filterable: cuisine, meal_types, difficulty, cook_time, is_published
- Sortable: cook_time, calories, popularity_score, created_at

---

## Error Handling Between Services

| Scenario | Behavior |
|----------|----------|
| Recommendation service timeout (>10s) | Retry 1x → fallback popularity-based |
| Recommendation service 500 | Log error → fallback popularity-based |
| Recommendation service down | Health check marks unhealthy → all requests use fallback |
| Weather API fail | Use cached data → if no cache, skip weather context |
| Meilisearch down | Fallback to MySQL LIKE search (slower) |
| Redis down | Session/cache miss → hit DB directly, log warning |
