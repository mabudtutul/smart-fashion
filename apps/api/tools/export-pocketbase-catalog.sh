#!/usr/bin/env bash
# Export PocketBase catalog JSON for catalog:import-pocketbase.
# Usage:
#   PB_URL=https://your-pb.example.com PB_TOKEN=... ./tools/export-pocketbase-catalog.sh ./catalog-export.json
set -euo pipefail

OUT="${1:-./catalog-export.json}"
PB_URL="${PB_URL:?Set PB_URL}"
PB_TOKEN="${PB_TOKEN:?Set PB_TOKEN (superuser or admin record token)}"

fetch() {
  local collection="$1"
  curl -fsS "${PB_URL}/api/collections/${collection}/records?perPage=500" \
    -H "Authorization: Bearer ${PB_TOKEN}"
}

categories="$(fetch categories)"
products="$(fetch products)"

node -e "
const fs = require('fs');
const categories = JSON.parse(process.argv[1]);
const products = JSON.parse(process.argv[2]);
const out = {
  categories: categories.items || categories,
  products: products.items || products,
};
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 2));
" "$categories" "$products" "$OUT"

echo "Wrote ${OUT} ($(node -e "const d=require(process.argv[1]); console.log((d.categories?.length||0)+' categories, '+(d.products?.length||0)+' products')" "$OUT"))"
