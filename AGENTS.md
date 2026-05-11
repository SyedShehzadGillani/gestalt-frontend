## Cursor Cloud specific instructions

This is a **React SPA** (no backend). The Supabase client is fully stubbed — the app renders and navigates with zero external services.

### Quick reference

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` (Vite, port 8080) |
| Lint | `npm run lint` |
| Unit tests | `npm run test` (vitest) |
| Build | `npm run build` |

### Notes

- The pre-commit hook runs `lint-staged` (ESLint on `src/**/*.{ts,tsx}`). The codebase has ~91 pre-existing lint errors (`no-explicit-any`, `no-empty`, `no-require-imports`); these are not regressions.
- No `.env` file or secrets are needed — the Supabase client at `src/integrations/supabase/client.ts` returns mocked empty data.
- Vite binds to `[::]` (all interfaces) on port 8080; no port configuration needed.
- See `CLAUDE.md` for code style rules (TypeScript only, `@/` alias imports, Tailwind-only styling, shell files are protected).
