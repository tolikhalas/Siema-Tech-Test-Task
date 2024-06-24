#!/bin/bash

# Wait for the backend service to be ready
until docker exec siema-tech-backend-service bun --version > /dev/null 2>&1; do
  echo "Waiting for backend service to be ready..."
  sleep 2
done

# Run the migration
docker exec siema-tech-backend-service bun run migration:generate -- src/database/migrations/AddPermissionsToUser

# Run the migration
docker exec siema-tech-backend-service bun run migration:run