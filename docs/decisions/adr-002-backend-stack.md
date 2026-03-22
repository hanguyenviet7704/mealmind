# ADR-002: NestJS cho Backend API

## Status
Accepted

## Context
Cần chọn backend framework. Options: NestJS (TypeScript) vs FastAPI (Python).

## Decision
NestJS (TypeScript) cho main API service. Python chỉ dùng cho recommendation service.

## Reasons
- TypeScript shared types với frontend (Next.js, React Native)
- NestJS module system phù hợp domain-driven design
- Ecosystem TypeScript lớn hơn cho web API
- Python reserved cho ML workload (TensorFlow/PyTorch)
- Team có thể share validation schemas (Zod) giữa frontend và backend

## Consequences
- Recommendation service (Python) giao tiếp với API qua HTTP
- Cần maintain 2 runtimes (Node.js + Python)
