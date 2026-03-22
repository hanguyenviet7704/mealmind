FROM node:20
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

EXPOSE 3001

# Start the application
CMD ["pnpm", "--filter=@mealmind/service-api", "start"]
