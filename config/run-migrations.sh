#!/bin/bash

# Wait for the backend service to be ready
until docker-compose exec backend bun --version > /dev/null 2>&1; do
  echo "Waiting for backend service to be ready..."
  sleep 2
done

# Run the migration
docker-compose exec backend bun run migration:generate -- src/database/migrations/AddPermissionsToUser

# Run the migration
docker-compose exec backend bun run migration:run