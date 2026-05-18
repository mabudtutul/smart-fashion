#!/usr/bin/env bash
# Post-recovery validation for catalog images (run after deploy + apply-hostinger-routing + upload).
# Usage:
#   STAGING_API=https://api.smartfashion.site bash deploy/verify-production-images.sh
#   ADMIN_PASSWORD='***' bash deploy/verify-production-images.sh
set -euo pipefail

BASE="${STAGING_API:-https://api.smartfashion.site}"
BASE="${BASE%/}"
TMP="${TMPDIR:-/tmp}"
OUT="${TMP}/sf-img-verify"

mkdir -p "${OUT}"

echo "=== Smart Fashion production image verification ==="
echo "API: ${BASE}"
echo ""

curl -sS -o "${OUT}/products.json" -H 'Accept: application/json' "${BASE}/api/v1/products?perPage=5"
node -e "
const d=require('${OUT}/products.json'.replace(/\\\\/g,'/'));
const items=d.items||[];
let withPath=0, withUrl=0;
for (const p of items) {
  if (p.image_path) withPath++;
  if (p.image_url) withUrl++;
}
console.log('Products total:', d.totalItems ?? items.length);
console.log('With image_path:', withPath);
console.log('With image_url:', withUrl);
const sample=items.find(p=>p.image_url)||items[0];
if(sample) console.log('Sample:', JSON.stringify({id:sample.id,image_path:sample.image_path,image_url:sample.image_url},null,2));
if(!sample?.image_url) process.exit(2);
" || { echo "FAIL: no product image_url in API"; exit 1; }

IMG=$(node -e "const d=require('${OUT}/products.json'.replace(/\\\\/g,'/')); console.log((d.items||[]).find(p=>p.image_url)?.image_url||'')")
echo ""
echo "Direct image URL: ${IMG}"
CODE=$(curl -sS -o /dev/null -w "%{http_code}" "${IMG}" || echo "000")
echo "HTTP: ${CODE}"
[[ "${CODE}" == "200" ]] || { echo "FAIL: image URL not HTTP 200"; exit 1; }

echo ""
echo "PASS: API image_url present and file reachable at HTTP 200"
echo "Next: confirm storefront card at https://smartfashion.site (manual visual check)"

if [[ -n "${ADMIN_PASSWORD:-}" ]]; then
  curl -sS -X POST "${BASE}/api/v1/auth/login" \
    -H 'Content-Type: application/json' -H 'Accept: application/json' \
    -d "{\"identity\":\"${ADMIN_EMAIL:-admin@smartfashion.site}\",\"password\":\"${ADMIN_PASSWORD}\"}" \
    -o "${OUT}/login.json"
  TOKEN=$(node -e "console.log(require('${OUT}/login.json'.replace(/\\\\/g,'/')).token||'')")
  if [[ -n "${TOKEN}" ]]; then
    curl -sS -o "${OUT}/health.json" -H "Authorization: Bearer ${TOKEN}" -H 'Accept: application/json' \
      "${BASE}/api/v1/admin/media/health"
    echo ""
    echo "Media health:"
    node -e "console.log(JSON.stringify(require('${OUT}/health.json'.replace(/\\\\/g,'/')),null,2))"
  fi
fi
