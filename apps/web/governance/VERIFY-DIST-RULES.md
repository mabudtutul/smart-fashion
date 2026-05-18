# verify-dist governance rules

**Lock ID:** `PHASE-1-GOVERNANCE-2026-05-18`  
**Script:** `apps/web/tools/verify-dist.js`  
**Runs after:** `npm run build:clean` (vite build + this script)

## Structural checks (stale-hash prevention)

| Rule | On failure |
|------|------------|
| `dist/apps/web/index.html` exists | FAIL |
| Exactly **one** `assets/index-*.js` | FAIL (mixed deploy guard) |
| Exactly **one** `assets/index-*.css` | FAIL |
| `index.html` references match files on disk | FAIL |
| `dist/locales/bn` + `en` if `locales/` present | FAIL |

## Forbidden content (bundle + index.html)

- `api.smartfashion.site`
- `horizons-vite-error`, `horizons-runtime-error`, `horizons-console-error`, `horizons-navigation-error`
- `hcgi/platform`
- `railway.app`, `abc.up.railway`
- `smartfashion.site/api` not followed by `/v1`

## Required content

- Full `VITE_API_BASE_URL` from `apps/web/.env.production` (default: `https://smartfashion.site/api/v1`)

## PocketBase (Phase 2 — fail)

- Any `assets/pocketbaseClient-*.js` chunk
- `pocketbase` / `PocketBase` in JS bundle

## Not validated here

- Production server asset parity (see `PRODUCTION-VERIFY-CHECKLIST.md`)
- Horizon CDN image URLs in source (Phase 4 asset migration)
