#!/bin/sh
set -e

echo "==> Pulling latest changes..."
git pull --rebase

echo "==> Stopping containers..."
docker-compose down

echo "==> Building and starting containers..."
docker-compose up -d --build

echo "==> Done. Docs running on http://localhost:3325"
