# API Standards

## Base URL

```
/api/v1/
```

## Response Format

```json
{
  "data": {},
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100
  },
  "error": null
}
```

Error response:
```json
{
  "data": null,
  "meta": null,
  "error": {
    "code": "RECIPE_NOT_FOUND",
    "message": "Recipe with id 123 not found",
    "details": {}
  }
}
```

## Authentication

- Bearer JWT token in `Authorization` header
- Access token: short-lived (15 min)
- Refresh token: long-lived (7 days), httpOnly cookie

## Pagination

Query params: `?page=1&pageSize=20`
Response meta: `{ page, pageSize, total }`

## Naming Conventions

- Endpoints: kebab-case (`/meal-plans`, `/taste-profiles`)
- Query params: camelCase (`pageSize`, `mealType`)
- Body fields: camelCase

## HTTP Methods

- `GET` — read
- `POST` — create
- `PATCH` — partial update
- `DELETE` — delete
- `PUT` — full replace (hiếm dùng)

## Status Codes

- `200` — success
- `201` — created
- `204` — no content (delete)
- `400` — validation error
- `401` — unauthorized
- `403` — forbidden
- `404` — not found
- `409` — conflict
- `422` — unprocessable entity
- `500` — internal server error
