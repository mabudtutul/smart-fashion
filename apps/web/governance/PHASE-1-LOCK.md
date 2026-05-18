# Phase 1 lock record

| Field | Value |
|-------|--------|
| Lock ID | `PHASE-1-GOVERNANCE-2026-05-18` |
| Status | LOCKED |
| Scope | Build & deploy governance only |
| Predecessor | `PHASE-0-CONTINUITY-2026-05-18` |

## Artifacts

| Artifact | Path |
|----------|------|
| verify-dist rules | `governance/VERIFY-DIST-RULES.md` |
| verify-dist script | `tools/verify-dist.js` |
| Deploy runbook | `governance/FRONTEND-DEPLOY-RUNBOOK.md` |
| Production checklist | `governance/PRODUCTION-VERIFY-CHECKLIST.md` |
| Boundaries | `governance/BOUNDARIES.md` |
| Branding & media | `governance/BRANDING-AND-MEDIA.md` |
| Env contract example | `.env.example` (aligned to `.env.production`) |

## Local verify (existing dist, no rebuild)

```
node tools/verify-dist.js → FAIL: index.html contains forbidden "horizons-vite-error"
```

**CRITICAL:** Current `dist/` was built with Horizon-injected `index.html`. Expected until Phase 2 strips `vite.config.js` injections and a new `build:clean` is authorized.

## Not executed in Phase 1

- `npm run build` / `build:clean`
- Production rsync / SSH purge
- Package removal, Vite config edits, UI rewrite

## Next phase (requires authorization)

**Phase 2 — Runtime excision:** remove PocketBase imports, Horizon prod injections in `vite.config.js`, driver switches.
