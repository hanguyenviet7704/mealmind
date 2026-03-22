# Event Model

## User Interaction Events

Mọi hành vi user được track để cải thiện AI recommendation:

| Event | Trigger | Data |
|-------|---------|------|
| `recipe.viewed` | User mở recipe detail | userId, recipeId, dwellTime |
| `recipe.bookmarked` | User bookmark recipe | userId, recipeId |
| `recipe.rated` | User đánh giá | userId, recipeId, rating (1-5) |
| `suggestion.accepted` | User chọn gợi ý | userId, recipeId, position, context |
| `suggestion.skipped` | User bỏ qua gợi ý | userId, recipeId, position, context |
| `meal_plan.created` | User tạo meal plan | userId, planId, weekStart |
| `meal_plan.slot_swapped` | User đổi món trong plan | userId, planId, oldRecipeId, newRecipeId |
| `search.performed` | User search | userId, query, resultCount |
| `onboarding.completed` | User hoàn thành onboarding | userId, profileData |

## Event Flow

```
User Action → API → Event Bus (Redis) → Workers → Analytics DB + ML Pipeline
```

Events dùng cho:
1. **Analytics** — Mixpanel/Amplitude tracking
2. **ML Training** — Feedback loop cho recommendation model
3. **Notifications** — Trigger push notifications
