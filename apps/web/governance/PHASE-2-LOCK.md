# Phase 2 lock record

| Field | Value |
|-------|--------|
| Lock ID | `PHASE-2-RUNTIME-EXCISION-2026-05-18` |
| Status | LOCKED |
| Predecessor | `PHASE-1-GOVERNANCE-2026-05-18` |

## Excised

| Target | Action |
|--------|--------|
| Horizon prod HTML injections | Removed from `vite.config.js` |
| Horizon dev Vite plugins | Removed from config |
| `pocketbase` npm dependency | Removed |
| `pocketbaseClient.js`, `pocketbaseCatalog.js`, `pocketbaseAdminCatalog.js` | Deleted |
| `BlogCard.jsx` | Deleted (PB-only) |
| `BlogSection.jsx` | Stub null (hidden) |
| Dual catalog/admin drivers | Laravel-only exports |
| PB sync bridge calls | Removed from `adminMedia/index.js` + `laravelAdminMedia.js` |
| `readDriver()` | Always `laravel` |

## VERIFY (controlled `npm run build:clean`)

```
[verify-dist] OK
index-DCl7OQWv.js | index-tRijzGBq.css
contract API: https://smartfashion.site/api/v1
no pocketbaseClient chunk
```

## KEEP (continuity debt — not runtime)

- Logo/hero `horizons-cdn.hostinger.com` URLs in `Header.jsx` / `HeroSection.jsx` (asset migration = later phase)
- Dead `plugins/*` Horizon editor files on disk (unreferenced; inert)

## Not executed

- Production deploy / hosting purge
- Backend changes
- UI redesign

## Next (authorization required)

**Phase 3** — API client layer consolidation, or **Phase 4** — storefront reconstruction.
