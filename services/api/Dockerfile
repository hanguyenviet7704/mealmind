FROM node:20
# bust cache 2026-03-22
RUN corepack enable
WORKDIR /app

# Copy all code for monorepo context
COPY . .

# Install dependencies
RUN pnpm install

# Generate Prisma Client
RUN pnpm --filter=@mealmind/service-api prisma:generate

# Build the API
RUN pnpm --filter=@mealmind/service-api build

EXPOSE 4000

# Run DB migrations then start the server
CMD ["sh", "-c", "cd /app/services/api && npx prisma migrate deploy && npx prisma db seed && node dist/main"]
