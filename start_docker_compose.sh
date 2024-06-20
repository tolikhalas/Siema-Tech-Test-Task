#!/bin/bash

# Run your pre-configuration script
./config/preconfig.sh

# Check if pre-configuration script executed successfully
if [ $? -ne 0 ]; then
  echo "Pre-configuration script failed. Exiting."
  exit 1
fi

# Determine which environment to use
if [ "$1" = "dev" ]; then
  source env/.env.development.local
  docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up
elif [ "$1" = "prod" ]; then
  source env/.env.prod.local
  docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up
else
  echo "Usage: $0 {dev|prod}"
  exit 1
fi
