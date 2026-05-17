#!/usr/bin/env bash
# L7C import on server (from private/smartfashion-api/)
# Usage:
#   EXPORT_JSON=~/catalog-export.json PB_DATA=~/pb_data ./deploy/import-staging.sh
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${APP_DIR}"

EXPORT_JSON="${EXPORT_JSON:?Set EXPORT_JSON path to combined catalog JSON}"
PB_DATA="${PB_DATA:-}"

echo "→ dry-run (records)"
php artisan catalog:import-pocketbase "${EXPORT_JSON}" --dry-run

if [[ -n "${PB_DATA}" && -d "${PB_DATA}" ]]; then
  echo "→ dry-run (images)"
  php artisan catalog:import-pocketbase "${EXPORT_JSON}" --dry-run --with-images --pb-storage="${PB_DATA}"
fi

read -r -p "Apply import? [y/N] " confirm
[[ "${confirm}" == [yY] ]] || exit 0

php artisan catalog:import-pocketbase "${EXPORT_JSON}"

if [[ -n "${PB_DATA}" && -d "${PB_DATA}" ]]; then
  php artisan catalog:import-pocketbase "${EXPORT_JSON}" --with-images --pb-storage="${PB_DATA}"
fi

echo "Import done."
