#!/bin/bash
# Start all services in Docker (Full containerized)

echo "Starting MealMind in full Docker mode..."

# Build and start all services
# Using --build to ensure newest code is used
docker compose up -d --build

# Wait for DB to be ready for migrations
echo "Waiting for MySQL to be ready..."
sleep 10

# Run migrations inside the api container
echo "Running migrations inside api container..."
docker exec mealmind-api npx prisma migrate dev --name sync_schema

echo "MealMind is running at:"
echo "- Web: http://localhost:3000"
echo "- API: http://localhost:3001/api/v1"
echo "- Recommendation AI: http://localhost:8001"
echo "- MySQL: localhost:33061 (external)"
echo "- Meilisearch: http://localhost:7700"
echo "- Redis: localhost:6379"
