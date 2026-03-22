FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /app

# Build args
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy all code for monorepo context
COPY . .

# Install dependencies
RUN pnpm install

# Build the web app
RUN pnpm --filter=@mealmind/app-web build

EXPOSE 3000

# Start the application
CMD ["pnpm", "--filter=@mealmind/app-web", "start"]
