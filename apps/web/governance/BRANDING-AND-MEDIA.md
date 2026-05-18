# Branding and image/media continuity governance

**Lock ID:** `PHASE-1-GOVERNANCE-2026-05-18`  
**Source of truth (Phase 0):** `PHASE-0-CONTINUITY-2026-05-18`

## Reusable branding constants

| Constant | Location | Value |
|----------|----------|--------|
| Store name | `src/lib/adminBranding.js` | `Smart Fashion` |
| Admin owner (BN) | `src/lib/adminBranding.js` | `মোহাম্মদ হোসেন` |
| Primary orange | `src/index.css` | `hsl(30 100% 50%)` / `#FF8C00` in components |
| Font | `src/index.css` | DM Sans |

**Rule:** Reconstruction imports branding from one module + CSS tokens; no ad-hoc hex in new code.

## Logo / hero external assets (CRITICAL debt)

| Asset | Current URL host |
|-------|------------------|
| Header logo | `horizons-cdn.hostinger.com` |
| Hero fallback | same CDN |

**Phase 4+ action:** Mirror to `public/brand/` and update components; do not change dimensions/aspect without continuity sign-off.

## Image optimization continuity (Laravel)

| Concept | Contract |
|---------|----------|
| Product variants | `card`, `main`, `thumb` → `.webp` under `/uploads/products/{id}/` |
| Category variants | `banner`, `thumb` |
| Size map | `recordImageUrl.js` `LARAVEL_SIZE_KEYS` |
| API fields | `image_url`, `image_urls` from `ProductResource` |
| Admin upload | `POST /api/v1/admin/products/{id}/image` (multipart) |
| Admin delete | `DELETE .../image` |

**Rule:** Reconstruction keeps `CatalogImage` + `recordImageUrl` behavior unless API contract changes (backend immutable).

## Build output media

- Do not ship hero/logo from Horizon CDN in **new** static branding without migration plan.
- `verify-dist` does not validate CDN URLs in source (runtime excision phase).
