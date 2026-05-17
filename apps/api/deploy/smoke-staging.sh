#!/usr/bin/env bash
# Smoke test staging API from any machine with curl
# Usage: STAGING_API=https://staging-api.smartfashion.site ./smoke-staging.sh
set -euo pipefail

BASE="${STAGING_API:-https://staging-api.smartfashion.site}"
BASE="${BASE%/}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@smartfashion.site}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

pass=0
fail=0

check() {
  local name="$1" code="$2" expect="$3"
  if [[ "${code}" == "${expect}" ]]; then
    echo "PASS ${name} (${code})"
    pass=$((pass + 1))
  else
    echo "FAIL ${name} (got ${code}, want ${expect})"
    fail=$((fail + 1))
  fi
}

code=$(curl -sS -o /tmp/sf-up.json -w "%{http_code}" "${BASE}/up" || echo "000")
check "/up" "${code}" "200"

code=$(curl -sS -o /tmp/sf-cat.json -w "%{http_code}" "${BASE}/api/v1/categories?perPage=1" || echo "000")
check "GET /api/v1/categories" "${code}" "200"

code=$(curl -sS -o /tmp/sf-prod.json -w "%{http_code}" "${BASE}/api/v1/products?perPage=1" || echo "000")
check "GET /api/v1/products" "${code}" "200"

if command -v node >/dev/null 2>&1; then
  img=$(node -e "
    const d=require('/tmp/sf-prod.json');
    const u=d?.items?.[0]?.image_url;
    if(u) console.log(u); else process.exit(2);
  " 2>/dev/null || true)
  if [[ -n "${img:-}" ]]; then
    icode=$(curl -sS -o /dev/null -w "%{http_code}" "${img}" || echo "000")
    check "product image_url" "${icode}" "200"
  else
    echo "SKIP product image_url (no items or no image_url)"
  fi
fi

if [[ -n "${ADMIN_PASSWORD}" ]]; then
  curl -sS -X POST "${BASE}/api/v1/auth/login" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}" \
    -o /tmp/sf-login.json
  token=$(node -e "const d=require('/tmp/sf-login.json'); console.log(d.token||'')" 2>/dev/null || true)
  if [[ -n "${token:-}" ]]; then
    acode=$(curl -sS -o /dev/null -w "%{http_code}" \
      -H "Authorization: Bearer ${token}" \
      "${BASE}/api/v1/admin/products?perPage=1" || echo "000")
    check "GET /api/v1/admin/products (auth)" "${acode}" "200"
  else
    echo "FAIL admin login (no token)"
    fail=$((fail + 1))
  fi
else
  echo "SKIP admin CRUD (set ADMIN_PASSWORD)"
fi

echo "---"
echo "Passed: ${pass}  Failed: ${fail}"
exit $([[ "${fail}" -eq 0 ]] && echo 0 || echo 1)
