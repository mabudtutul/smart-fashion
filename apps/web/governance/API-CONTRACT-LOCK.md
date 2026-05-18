# API contract lock

**Lock ID:** `PHASE-3-API-CLIENT-2026-05-18`

## Base

| Role | URL |
|------|-----|
| JSON API | `https://smartfashion.site/api/v1` |
| Site origin (uploads, Sanctum) | `https://smartfashion.site` |
| Env | `VITE_API_BASE_URL=https://smartfashion.site/api/v1` |

## Single client layer

| Module | Responsibility |
|--------|----------------|
| `src/lib/api/config.js` | URL builders |
| `src/lib/api/endpoints.js` | Path constants |
| `src/lib/api/publicClient.js` | Storefront GET JSON |
| `src/lib/api/adminClient.js` | Admin Bearer JSON |
| `src/lib/api/auth.js` | Sanctum CSRF + login token |
| `src/lib/api/uploads.js` | Multipart upload + DELETE |
| `src/lib/api/errors.js` | `ApiError` |
| `src/lib/api/parse.js` | List normalize, error messages, HTML detect |

## Legacy re-exports (compat)

- `catalog/catalogHttp.js` → `ApiError` as `CatalogApiError`
- `adminHttp.js` → timeouts + `parseApiErrorMessage`
- Domain modules (`laravelCatalog`, `laravelAdminCatalog`, etc.) call `api/*` only

## Verification

```bash
npm run verify:api-contract   # source scan
npm run build:clean           # includes contract + dist checks
```
