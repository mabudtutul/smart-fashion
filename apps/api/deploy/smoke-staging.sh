#!/usr/bin/env bash
# Smoke test live/staging API (JSON + optional admin auth)
# Usage: STAGING_API=https://api.smartfashion.site ADMIN_PASSWORD=secret ./smoke-staging.sh
set -euo pipefail

BASE="${STAGING_API:-https://api.smartfashion.site}"
BASE="${BASE%/}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@smartfashion.site}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

pass=0
fail=0
warn=0

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

assert_json() {
  local file="$1" label="$2"
  if [[ ! -s "${file}" ]]; then
    echo "FAIL ${label} (empty body)"
    fail=$((fail + 1))
    return 1
  fi
  if head -c 20 "${file}" | grep -qi '<!DOCTYPE\|<html'; then
    echo "FAIL ${label} (HTML response — Laravel docroot/bootstrap misconfigured)"
    fail=$((fail + 1))
    return 1
  fi
  if ! node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "${file}" 2>/dev/null; then
    echo "FAIL ${label} (not valid JSON)"
    fail=$((fail + 1))
    return 1
  fi
  return 0
}

echo "API base: ${BASE}"

code=$(curl -sS -o /tmp/sf-up.json -w "%{http_code}" "${BASE}/up" || echo "000")
check "/up" "${code}" "200"
assert_json /tmp/sf-up.json "/up" || true

code=$(curl -sS -o /tmp/sf-cat.json -w "%{http_code}" "${BASE}/api/v1/categories?perPage=3" || echo "000")
check "GET /api/v1/categories" "${code}" "200"
if assert_json /tmp/sf-cat.json "categories"; then
  node -e "const d=require('/tmp/sf-cat.json'); console.log('  categories:', d.totalItems ?? d.items?.length ?? 0)"
fi

code=$(curl -sS -o /tmp/sf-prod.json -w "%{http_code}" "${BASE}/api/v1/products?perPage=3" || echo "000")
check "GET /api/v1/products" "${code}" "200"
if assert_json /tmp/sf-prod.json "products"; then
  node -e "const d=require('/tmp/sf-prod.json'); console.log('  products:', d.totalItems ?? d.items?.length ?? 0)"
fi

if command -v node >/dev/null 2>&1 && assert_json /tmp/sf-prod.json "product image check"; then
  img=$(node -e "
    const d=require('/tmp/sf-prod.json');
    const u=d?.items?.[0]?.image_url;
    if(u) console.log(u); else process.exit(2);
  " 2>/dev/null || true)
  if [[ -n "${img:-}" ]]; then
    icode=$(curl -sS -o /dev/null -w "%{http_code}" "${img}" || echo "000")
    check "product image_url" "${icode}" "200"
  else
    echo "WARN product image_url (no items or missing image_url)"
    warn=$((warn + 1))
  fi
fi

if [[ -n "${ADMIN_PASSWORD}" ]]; then
  curl -sS -X POST "${BASE}/api/v1/auth/login" \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d "{\"identity\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}" \
    -o /tmp/sf-login.json
  if assert_json /tmp/sf-login.json "auth login"; then
    token=$(node -e "const d=require('/tmp/sf-login.json'); console.log(d.token||'')" 2>/dev/null || true)
    if [[ -n "${token:-}" ]]; then
      acode=$(curl -sS -o /tmp/sf-admin.json -w "%{http_code}" \
        -H "Authorization: Bearer ${token}" \
        -H 'Accept: application/json' \
        "${BASE}/api/v1/admin/products?perPage=1" || echo "000")
      check "GET /api/v1/admin/products (auth)" "${acode}" "200"
      assert_json /tmp/sf-admin.json "admin products" || true
    else
      echo "FAIL admin login (no token in JSON)"
      fail=$((fail + 1))
    fi
  fi
else
  echo "SKIP admin CRUD (set ADMIN_PASSWORD)"
fi

echo "---"
echo "Passed: ${pass}  Failed: ${fail}  Warnings: ${warn}"
exit $([[ "${fail}" -eq 0 ]] && echo 0 || echo 1)
