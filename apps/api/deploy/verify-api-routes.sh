#!/usr/bin/env bash
# Run on server inside private/smartfashion-api
set -euo pipefail
cd "$(dirname "$0")/.."

php artisan route:clear
echo "--- route:list (api/v1) ---"
php artisan route:list --path=api/v1
