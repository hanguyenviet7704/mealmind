#!/bin/bash
# Start all dev services

echo "Starting MealMind dev environment..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    exit 1
fi

# Start infrastructure
echo "Starting MySQL, Redis, Meilisearch..."
docker compose up -d mysql redis meilisearch

# Wait for services
echo "Waiting for services to be ready..."
sleep 3

# Run migrations
echo "Running database migrations..."
pnpm db:migrate

# Start all apps and services
echo "Starting all services..."
pnpm dev
