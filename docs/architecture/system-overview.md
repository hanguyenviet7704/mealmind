# System Overview

## High-Level Architecture

```
┌─────────────┐  ┌──────────────┐  ┌───────────────┐
│  Web App    │  │  Mobile App  │  │  Admin Panel  │
│  (Next.js)  │  │  (React      │  │  (Next.js)    │
│             │  │   Native)    │  │               │
└──────┬──────┘  └──────┬───────┘  └───────┬───────┘
       │                │                   │
       └────────────────┼───────────────────┘
                        │
                 ┌──────▼──────┐
                 │  API Gateway │
                 │  (NestJS)    │
                 └──────┬──────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
   ┌──────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
   │ PostgreSQL  │ │ Redis  │ │ Meilisearch│
   │ (primary DB)│ │ (cache)│ │ (search)   │
   └─────────────┘ └────────┘ └────────────┘
                        │
              ┌─────────▼─────────┐
              │ Recommendation    │
              │ Service (Python)  │
              │                   │
              │ • Candidate Gen   │
              │ • Ranking         │
              │ • Filters         │
              │ • Diversity       │
              └─────────┬─────────┘
                        │
              ┌─────────▼─────────┐
              │ Workers           │
              │ • Notifications   │
              │ • Data sync       │
              │ • ML batch jobs   │
              └───────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web | Next.js + Tailwind + Zustand + TanStack Query |
| Mobile | React Native |
| API | NestJS (TypeScript) |
| AI/ML | Python + TensorFlow/PyTorch |
| Database | MySQL (Prisma ORM) |
| Cache | Redis |
| Search | Meilisearch |
| Storage | S3/R2 |
| CI/CD | GitHub Actions |
| Container | Docker + Docker Compose (dev), K8s (prod) |

## Monorepo Structure

Turborepo + pnpm workspaces. Xem [PROJECT_MAP.md](../../PROJECT_MAP.md).
