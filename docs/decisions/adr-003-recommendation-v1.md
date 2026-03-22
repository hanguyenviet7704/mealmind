# ADR-003: Recommendation Engine v1

## Status
Accepted

## Context
MVP cần recommendation engine nhưng chưa có user behavior data.

## Decision
V1 dùng content-based filtering + popularity fallback. Collaborative filtering defer sang Phase 2.

## Reasons
- Content-based không cần user history → hoạt động ngay từ đầu
- Popularity fallback xử lý cold start
- Collaborative filtering cần data volume mà MVP chưa có
- Giữ đơn giản để validate product-market fit trước

## Pipeline v1

```
User Profile (taste, dietary) + Context (time, season)
  → Content-Based Scoring (recipe attributes match profile)
  → Popularity Boost (trending, highly rated)
  → Dietary Filter (hard filter: allergens, restrictions)
  → Diversity Check (không lặp món gần đây)
  → Top 3-5 results
```

## Consequences
- Recommendation chất lượng trung bình ở MVP (chấp nhận được)
- Cần collect interaction data từ đầu để Phase 2 có data train collaborative filtering
- Architecture phải extensible để thêm model mới
