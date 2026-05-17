#!/usr/bin/env bash
# Apply Hostinger public routing fix (run ON SERVER via SSH).
# Usage: cd ~/domains/api.smartfashion.site/private/smartfashion-api && bash deploy/apply-hostinger-routing.sh
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOMAIN_ROOT="$(cd "${APP_DIR}/../.." && pwd)"
PUBLIC="${DOMAIN_ROOT}/public_html"
API_PUBLIC="${PUBLIC}/api"
DEPLOY="${APP_DIR}/deploy"

echo "Domain root: ${DOMAIN_ROOT}"
echo "Public:      ${PUBLIC}"

mkdir -p "${PUBLIC}/uploads/products" "${PUBLIC}/uploads/categories" "${API_PUBLIC}"

cp "${DEPLOY}/hostinger-public-index.php" "${PUBLIC}/index.php"
cp "${DEPLOY}/hostinger-public-htaccess" "${PUBLIC}/.htaccess"
cp "${DEPLOY}/hostinger-bootstrap.php" "${PUBLIC}/hostinger-bootstrap.php"

cp "${DEPLOY}/hostinger-public-api-index.php" "${API_PUBLIC}/index.php"
cp "${DEPLOY}/hostinger-public-api-htaccess" "${API_PUBLIC}/.htaccess"
cp "${DEPLOY}/hostinger-bootstrap.php" "${API_PUBLIC}/hostinger-bootstrap.php"

if [[ -f "${APP_DIR}/public/uploads/.htaccess" ]]; then
  cp "${APP_DIR}/public/uploads/.htaccess" "${PUBLIC}/uploads/.htaccess"
fi

if [[ -f "${APP_DIR}/public/.htaccess" ]] && [[ ! -f "${PUBLIC}/.htaccess" ]]; then
  cp "${APP_DIR}/public/.htaccess" "${PUBLIC}/.htaccess"
fi

cd "${APP_DIR}"
php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan config:cache

echo ""
echo "Registered API routes (expect api/v1/categories, api/v1/products):"
php artisan route:list --path=api/v1 --columns=method,uri,name 2>/dev/null | head -20 || php artisan route:list | head -30

echo ""
echo "Applied. Verify:"
echo "  curl -sS -H 'Accept: application/json' https://api.smartfashion.site/up"
echo "  curl -sS -H 'Accept: application/json' 'https://api.smartfashion.site/api/v1/categories?perPage=1'"
echo ""
echo "Note: route:cache skipped — use route:clear after route changes on Hostinger."
