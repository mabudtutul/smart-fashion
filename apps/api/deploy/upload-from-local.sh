#!/usr/bin/env bash
# Upload Laravel API to Hostinger staging (run from repo: apps/api/deploy/)
# Required env:
#   HOSTINGER_SSH=user@hostinger-host   (hPanel → SSH → hostname)
# Optional:
#   REMOTE_DOMAIN=staging-api.smartfashion.site
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SSH_TARGET="${HOSTINGER_SSH:?Set HOSTINGER_SSH (e.g. u123@ssh.hostinger.com)}"
REMOTE_DOMAIN="${REMOTE_DOMAIN:-staging-api.smartfashion.site}"
REMOTE_BASE="domains/${REMOTE_DOMAIN}"
PRIVATE="${REMOTE_BASE}/private/smartfashion-api"
PUBLIC="${REMOTE_BASE}/public_html"

echo "→ Sync app to ~/${PRIVATE}/"
rsync -avz --delete \
  --exclude-from="${SCRIPT_DIR}/rsync-exclude.txt" \
  "${API_ROOT}/" "${SSH_TARGET}:${PRIVATE}/"

echo "→ Sync Hostinger public routing (docroot + public_html/api/)"
ssh "${SSH_TARGET}" "mkdir -p ${PUBLIC}/api ${PUBLIC}/uploads/products ${PUBLIC}/uploads/categories"

scp "${SCRIPT_DIR}/hostinger-bootstrap.php" "${SSH_TARGET}:${PUBLIC}/hostinger-bootstrap.php"
scp "${SCRIPT_DIR}/hostinger-public-index.php" "${SSH_TARGET}:${PUBLIC}/index.php"
scp "${SCRIPT_DIR}/hostinger-public-htaccess" "${SSH_TARGET}:${PUBLIC}/.htaccess"

scp "${SCRIPT_DIR}/hostinger-bootstrap.php" "${SSH_TARGET}:${PUBLIC}/api/hostinger-bootstrap.php"
scp "${SCRIPT_DIR}/hostinger-public-api-index.php" "${SSH_TARGET}:${PUBLIC}/api/index.php"
scp "${SCRIPT_DIR}/hostinger-public-api-htaccess" "${SSH_TARGET}:${PUBLIC}/api/.htaccess"

rsync -avz \
  "${API_ROOT}/public/uploads/.htaccess" \
  "${API_ROOT}/public/uploads/products/.gitignore" \
  "${API_ROOT}/public/uploads/categories/.gitignore" \
  "${SSH_TARGET}:${PUBLIC}/uploads/"

echo "Done. SSH: cd ~/${PRIVATE} && bash deploy/apply-hostinger-routing.sh"
