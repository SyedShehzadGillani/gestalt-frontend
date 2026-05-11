## Cursor Cloud specific instructions

**Product:** GESTALT is a multi-tenant SaaS brand management platform (React SPA) with three portals: Agency (`/agency/*`), Client (`/client/:id/*`), and HQ Admin (`/hq/*`).

**Tech stack:** React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + shadcn/ui. Backend is Supabase (hosted, fully stubbed in `src/integrations/supabase/client.ts` — no real backend needed for UI dev).

### Running the app

- `npm run dev` — starts Vite dev server on **port 8080**
- All data is mocked; no external services or database required.

### Key commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Unit tests | `npm run test` |
| Build | `npm run build` |

### Gotchas

- **Pre-existing lint errors:** The codebase has ~90 ESLint errors (mostly `@typescript-eslint/no-explicit-any` and `no-empty`). The lint-staged pre-commit hook runs `eslint --max-warnings=0 --no-ignore` only on staged `src/**/*.{ts,tsx}` files, so new code must be lint-clean even though the full repo isn't.
- **Supabase client is a stub:** `src/integrations/supabase/client.ts` returns empty/null for all queries. Auth flows won't actually authenticate — the UI renders with mock/hardcoded data throughout.
- **Package manager:** Use `npm` (there is a `package-lock.json`). A `bun.lock` also exists but `bun` is not the primary package manager.
- **Code rules:** See `CLAUDE.md` at the repo root for component architecture, styling, and shell-file rules.
