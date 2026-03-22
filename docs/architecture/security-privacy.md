# Security & Privacy

## Authentication
- Bcrypt password hashing (salt rounds: 12)
- JWT with RS256 signing
- Refresh token rotation
- OAuth2 (Google, Apple) via industry-standard libraries

## Data Protection
- Sensitive fields encrypted at rest (dietary/medical info)
- PII minimal collection — chỉ lấy data cần thiết
- User data deletion on account delete (GDPR-style)
- No selling user data to third parties

## API Security
- Rate limiting per user/IP
- Input validation (Zod) trên mọi endpoint
- CORS whitelist
- Helmet headers (XSS, CSRF protection)
- SQL injection prevention via Prisma ORM (parameterized queries)

## Infrastructure
- HTTPS only
- Environment secrets via env vars, không hardcode
- Database connections via SSL
- Regular dependency audit (`pnpm audit`)
