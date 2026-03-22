# Sequence Diagrams

Luồng xử lý cho các flow phức tạp. Agent đọc trước khi implement.

## 1. Auth — Login Flow

```
Client                    API (NestJS)              DB
  │                         │                        │
  │ POST /auth/login        │                        │
  │ {email, password}       │                        │
  │ ──────────────────────> │                        │
  │                         │ SELECT user by email   │
  │                         │ ─────────────────────> │
  │                         │ <───── user row ────── │
  │                         │                        │
  │                         │ bcrypt.compare(pwd)    │
  │                         │ (nếu sai → 401)       │
  │                         │                        │
  │                         │ Generate access token  │
  │                         │ (JWT RS256, 15 min)    │
  │                         │                        │
  │                         │ Generate refresh token │
  │                         │ (random 256-bit)       │
  │                         │                        │
  │                         │ INSERT refresh_tokens  │
  │                         │ (SHA256 hash)          │
  │                         │ ─────────────────────> │
  │                         │                        │
  │ <── 200 {accessToken,   │                        │
  │     refreshToken, user} │                        │
```

## 2. Auth — Token Refresh Flow

```
Client                    API (NestJS)              DB
  │                         │                        │
  │ POST /auth/refresh      │                        │
  │ {refreshToken}          │                        │
  │ ──────────────────────> │                        │
  │                         │ hash = SHA256(token)   │
  │                         │ SELECT by token_hash   │
  │                         │ WHERE revoked_at NULL  │
  │                         │ ─────────────────────> │
  │                         │ <─── token row ─────── │
  │                         │                        │
  │                         │ Check expires_at       │
  │                         │ (nếu expired → 401)    │
  │                         │                        │
  │                         │ Revoke old token       │
  │                         │ UPDATE SET revoked_at  │
  │                         │ ─────────────────────> │
  │                         │                        │
  │                         │ Generate new pair      │
  │                         │ INSERT new refresh     │
  │                         │ ─────────────────────> │
  │                         │                        │
  │ <── 200 {new access,    │                        │
  │     new refresh}        │                        │
```

## 3. Meal Suggestion — Full Flow

```
Client              API (NestJS)         Recommendation (Python)    Redis        Weather API
  │                    │                        │                     │              │
  │ GET /suggestions   │                        │                     │              │
  │ ?mealType=lunch    │                        │                     │              │
  │ ─────────────────> │                        │                     │              │
  │                    │                        │                     │              │
  │                    │ 1. Get user profile     │                     │              │
  │                    │ + dietary restrictions  │                     │              │
  │                    │ (from DB)               │                     │              │
  │                    │                        │                     │              │
  │                    │ 2. Get weather          │                     │              │
  │                    │ ───────────────────────────────────────────> │              │
  │                    │ <──────────── cached? ── │                    │              │
  │                    │                         │                    │              │
  │                    │ (if no cache)           │                     │              │
  │                    │ ────────────────────────────────────────────────────────── >│
  │                    │ <─────────────────── weather data ─────────────────────── ─│
  │                    │ ──── cache 30min ──────────────────────────> │              │
  │                    │                        │                     │              │
  │                    │ 3. Get recent meals     │                     │              │
  │                    │ (last 2 days, from DB)  │                     │              │
  │                    │                        │                     │              │
  │                    │ 4. Call recommendation  │                     │              │
  │                    │ POST /recommend         │                     │              │
  │                    │ {userId, context,       │                     │              │
  │                    │  filters, excludeIds}   │                     │              │
  │                    │ ──────────────────────> │                     │              │
  │                    │                        │                     │              │
  │                    │                        │ Content-based score  │              │
  │                    │                        │ + Popularity boost   │              │
  │                    │                        │ + Context bias       │              │
  │                    │                        │ → Filter             │              │
  │                    │                        │ → Diversity check    │              │
  │                    │                        │ → Top 5              │              │
  │                    │                        │                     │              │
  │                    │ <── suggestions[] ───── │                     │              │
  │                    │                        │                     │              │
  │                    │ 5. Enrich with recipe   │                     │              │
  │                    │ data (name, image,      │                     │              │
  │                    │ cookTime, calories)     │                     │              │
  │                    │ (from DB)               │                     │              │
  │                    │                        │                     │              │
  │ <── 200            │                        │                     │              │
  │ {suggestions[],    │                        │                     │              │
  │  context}          │                        │                     │              │
```

## 4. Meal Plan Generation

```
Client              API (NestJS)         Recommendation (Python)    DB
  │                    │                        │                    │
  │ POST /meal-plans   │                        │                    │
  │ {weekStart}        │                        │                    │
  │ ─────────────────> │                        │                    │
  │                    │                        │                    │
  │                    │ 1. Validate: max 4 drafts │                 │
  │                    │ ─────────────────────────────────────────> │
  │                    │                        │                    │
  │                    │ 2. Get profile + dietary + nutrition goals  │
  │                    │ ─────────────────────────────────────────> │
  │                    │                        │                    │
  │                    │ 3. POST /recommend/meal-plan               │
  │                    │ {userId, filters,       │                    │
  │                    │  nutritionTarget,       │                    │
  │                    │  lockedSlots: []}       │                    │
  │                    │ ──────────────────────> │                    │
  │                    │                        │                    │
  │                    │                        │ For each day (1-7): │
  │                    │                        │   For each meal:    │
  │                    │                        │     Score recipes   │
  │                    │                        │     Apply filters   │
  │                    │                        │     Check diversity │
  │                    │                        │     Check nutrition │
  │                    │                        │     Pick best       │
  │                    │                        │                    │
  │                    │ <── 21 slots ────────── │                    │
  │                    │                        │                    │
  │                    │ 4. Create meal_plan     │                    │
  │                    │ + 21 meal_plan_items    │                    │
  │                    │ ─────────────────────────────────────────> │
  │                    │                        │                    │
  │                    │ 5. Calculate nutrition  │                    │
  │                    │ summary per day         │                    │
  │                    │                        │                    │
  │ <── 201 {plan +    │                        │                    │
  │  slots + nutrition} │                        │                    │
```

## 5. Meal Plan — Swap Slot

```
Client              API (NestJS)         Recommendation (Python)    DB
  │                    │                        │                    │
  │ GET /meal-plans/   │                        │                    │
  │ {id}/slots/{id}/   │                        │                    │
  │ suggestions        │                        │                    │
  │ ─────────────────> │                        │                    │
  │                    │                        │                    │
  │                    │ 1. Get current plan     │                    │
  │                    │ + locked slots          │                    │
  │                    │ ─────────────────────────────────────────> │
  │                    │                        │                    │
  │                    │ 2. POST /recommend      │                    │
  │                    │ {count: 5,              │                    │
  │                    │  excludeIds: [all plan  │                    │
  │                    │  recipe IDs]}           │                    │
  │                    │ ──────────────────────> │                    │
  │                    │ <── 5 suggestions ───── │                    │
  │                    │                        │                    │
  │ <── 200 [5 alternatives]                     │                    │
  │                    │                        │                    │
  │ PATCH /slots/{id}  │                        │                    │
  │ {recipeId: chosen} │                        │                    │
  │ ─────────────────> │                        │                    │
  │                    │ UPDATE meal_plan_items  │                    │
  │                    │ ─────────────────────────────────────────> │
  │ <── 200 updated    │                        │                    │
```

## 6. Interaction Tracking (Async)

```
Client              API (NestJS)              Redis              Workers
  │                    │                        │                    │
  │ (user swipes,      │                        │                    │
  │  views, bookmarks) │                        │                    │
  │                    │                        │                    │
  │ [batch mỗi 30s     │                        │                    │
  │  hoặc 10 events]   │                        │                    │
  │                    │                        │                    │
  │ POST /interactions  │                        │                    │
  │ {interactions[]}    │                        │                    │
  │ ─────────────────> │                        │                    │
  │                    │ INSERT user_interactions │                   │
  │                    │ (bulk insert to DB)     │                    │
  │                    │                        │                    │
  │                    │ PUBLISH interaction.batch│                   │
  │                    │ ──────────────────────> │                    │
  │ <── 202 Accepted   │                        │                    │
  │                    │                        │ ────────────────> │
  │                    │                        │                    │
  │                    │                        │           Workers: │
  │                    │                        │           Forward  │
  │                    │                        │           to Reco  │
  │                    │                        │           POST     │
  │                    │                        │           /feedback│
  │                    │                        │                    │
  │                    │                        │           Analytics│
  │                    │                        │           tracking │
```

## 7. Recipe Search (Meilisearch)

```
Client              API (NestJS)         Meilisearch         DB
  │                    │                      │                │
  │ GET /recipes       │                      │                │
  │ ?q=phở&cuisine=    │                      │                │
  │  north             │                      │                │
  │ ─────────────────> │                      │                │
  │                    │                      │                │
  │                    │ 1. Get user dietary   │                │
  │                    │ filters (from DB)     │                │
  │                    │ ────────────────────────────────────> │
  │                    │                      │                │
  │                    │ 2. Search with filters │               │
  │                    │ POST /indexes/recipes/ │               │
  │                    │ search                │                │
  │                    │ {q: "phở",           │                │
  │                    │  filter: "cuisine=    │                │
  │                    │  north AND            │                │
  │                    │  is_published=true"}  │                │
  │                    │ ────────────────────> │                │
  │                    │ <── hits[] ────────── │                │
  │                    │                      │                │
  │                    │ 3. Post-filter:       │                │
  │                    │ Remove recipes with   │                │
  │                    │ blacklisted ingredients│               │
  │                    │ (application layer)    │               │
  │                    │                      │                │
  │ <── 200 {recipes[],│                      │                │
  │  meta: {total}}    │                      │                │
```
