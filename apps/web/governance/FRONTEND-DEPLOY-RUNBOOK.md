# Frontend deploy runbook (atomic SPA only)

**Lock ID:** `PHASE-1-GOVERNANCE-2026-05-18`  
**Domain:** `smartfashion.site`  
**Docroot:** `~/domains/smartfashion.site/public_html/`

## Boundary (frontend-only)

| Touch | Do not touch |
|-------|----------------|
| `public_html/index.html` | `public_html/api/**` |
| `public_html/assets/**` | `private/smartfashion-api/**` |
| `public_html/locales/**` (if present) | `public_html/uploads/**` (unless separate authorized phase) |
| `public_html/favicon.svg`, `og-image.svg` (if updated) | Root `.htaccess` / `index.php` (Laravel routing) |

**Never run** `apps/api/deploy/apply-hostinger-routing.sh` on combined domain without SPA-safe variant.

## Pre-deploy (local — authorized only in build phases)

1. Confirm `apps/web/.env.production` contract unchanged.
2. `npm run build:clean` from `apps/web` (or repo root `npm run build`).
3. `verify-dist` must exit 0.
4. Record hashes: `index.html` → `assets/index-*.js`, `assets/index-*.css`.

## Production sync (operator SSH — execute only when deploy phase authorized)

```bash
DOMAIN=~/domains/smartfashion.site/public_html
LOCAL=dist/apps/web   # from repo root on operator machine

# 1. Backup (optional)
cp "$DOMAIN/index.html" "$DOMAIN/index.html.bak.$(date +%Y%m%d%H%M)"

# 2. Purge stale hashed assets (required)
rm -rf "$DOMAIN/assets/"*

# 3. Upload atomic set
rsync -avz LOCAL/index.html SSH:DOMAIN/
rsync -avz LOCAL/assets/ SSH:DOMAIN/assets/
rsync -avz LOCAL/locales/ SSH:DOMAIN/locales/   # if dist includes locales

# 4. Do NOT rsync --delete on public_html root
```

## Post-deploy verification

See `PRODUCTION-VERIFY-CHECKLIST.md`.

## Rollback

Restore `index.html.bak.*` and previous `assets/` backup if kept. Without backup, redeploy prior known-good `dist` artifact.
