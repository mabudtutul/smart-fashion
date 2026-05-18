# Frontend deployment boundaries

**Lock ID:** `PHASE-1-GOVERNANCE-2026-05-18`

## Safe to touch (frontend deploy phases only)

- `~/domains/smartfashion.site/public_html/index.html`
- `~/domains/smartfashion.site/public_html/assets/*`
- `~/domains/smartfashion.site/public_html/locales/*`
- `~/domains/smartfashion.site/public_html/favicon.svg`, `og-image.svg`

## Forbidden without separate authorization

| Target | Reason |
|--------|--------|
| `public_html/api/` | Laravel API bootstrap |
| `public_html/index.php`, root `.htaccess` | SPA vs API routing |
| `private/smartfashion-api/` | Backend immutable |
| `public_html/uploads/` | Media recovery phase |
| Server `.env`, PHP, DB | Backend immutable |
| `apply-hostinger-routing.sh` (full) | Overwrites SPA root |

## Safe asset purge (hosting — deploy phase only)

```bash
rm -rf ~/domains/smartfashion.site/public_html/assets/*
```

**Only** under `assets/`. Never `rm -rf public_html` or `public_html/api`.

## GitHub (all phases until authorized)

- No push, PR, or branch experiments without explicit approval.
