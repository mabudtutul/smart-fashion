# Production verification checklist (read-only)

**Lock ID:** `PHASE-1-GOVERNANCE-2026-05-18`  
**Use after:** authorized frontend deploy only

## A. Asset synchronization

- [ ] `public_html/index.html` script tag matches single `assets/index-*.js` on server
- [ ] `public_html/assets/` contains **one** `index-*.js`, **one** `index-*.css` (no orphan hashes)
- [ ] No reference in `index.html` to missing chunk files

## B. API runtime (read-only curl)

```bash
curl -sS -H 'Accept: application/json' \
  'https://smartfashion.site/api/v1/categories?perPage=1' | head -c 300
```

- [ ] Response is JSON (not `<!DOCTYPE html>`)
- [ ] Status 200 or expected API error JSON

## C. Storefront smoke (browser, incognito)

- [ ] Home loads; hero visible (API or fallback)
- [ ] Categories grid loads
- [ ] Product detail opens; image or placeholder
- [ ] Language switch BN ↔ EN
- [ ] Network: catalog calls go to `https://smartfashion.site/api/v1/...`

## D. Admin smoke

- [ ] `/admin/login` loads
- [ ] Login reaches dashboard (Sanctum — server env dependent)
- [ ] Product list loads from `/api/v1/admin/products`

## E. Forbidden signals

- [ ] No requests to `api.smartfashion.site`
- [ ] No bare `/api/categories` without `v1` in Network tab

## F. Record for lock

| Field | Value |
|-------|--------|
| Deploy date | |
| `index-*.js` hash | |
| Operator | |
| API JSON check | pass/fail |
| Notes | |
