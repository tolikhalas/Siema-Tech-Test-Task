#!/bin/bash

# Run your pre-configuration script
./config/preconfig.sh

# Check if pre-configuration script executed successfully
if [ $? -ne 0 ]; then
  echo "Pre-configuration script failed. Exiting."
  exit 1
fi

# Display environment variables
set -a
# Determine which environment to use
if [ "$1" = "dev" ]; then
  # Load environment variables from .env.development.local file
  source .env.development.local
  docker-compose -f docker-compose.dev.yaml up
elif [ "$1" = "prod" ]; then
  # Load environment variables from .env.prod.local file
  source .env.prod.local
  docker-compose -f docker-compose.prod.yaml up
elif [ "$1" = "down" ]; then
  docker-compose down
else
  echo "Usage: $0 {dev|prod|down}"
  exit 1
fi

# Run your post-configuration script
./config/postconfig.sh
