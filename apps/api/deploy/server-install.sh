#!/usr/bin/env bash
# Run ON Hostinger via SSH from private/smartfashion-api/
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${APP_DIR}"

if [[ ! -f .env ]]; then
  echo "Create .env first (cp .env.staging.example .env and fill DB_*)."
  exit 1
fi

echo "→ composer install --no-dev"
composer install --no-dev --optimize-autoloader --no-interaction

if ! grep -q '^APP_KEY=base64:' .env 2>/dev/null; then
  php artisan key:generate --force
fi

echo "→ migrate"
php artisan migrate --force

echo "→ cache"
php artisan config:cache
php artisan route:cache

echo "→ permissions"
chmod -R ug+rwx storage bootstrap/cache 2>/dev/null || true
UPLOADS="$(cd ../.. && pwd)/public_html/uploads"
if [[ -d "${UPLOADS}" ]]; then
  chmod -R ug+rwx "${UPLOADS}" 2>/dev/null || true
fi

php artisan about --only=environment,cache,drivers 2>/dev/null || php artisan --version

echo "→ verify catalog (after import)"
php artisan catalog:verify-import 2>/dev/null || echo "  (skip until import complete)"

echo "Install complete. Run: catalog:import-pocketbase, catalog:verify-import, deploy/smoke-staging.sh"
