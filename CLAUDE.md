# gestalt-react — React Code Rules

## Before Starting

**Always `git pull` latest before any change** — start from the newest code, never stale local state.

## Vault (Project Knowledge Base)

`vault/` is symlinked at `gestalt-react/vault/` → never committed to git.

**Read vault before starting any task** — it contains specs, decisions, bug log, phase plans, and context that are not in the code.

| Need | File |
|------|------|
| Module specs, design system | `vault/gestaltai/` |
| Active phase plan + status | `vault/plans/` |
| Architecture/tech decisions | `vault/adr/` |
| Bug inventory | `vault/bugs/BUGLOG.md` |
| Product/UX decisions | `vault/decisions/DECISIONS.md` |
| Non-obvious context notes | `vault/context/CONTEXT.md` |
| Glossary, abbreviations, scores | `vault/PROJECT-GLOSSARY.md` |

**Update vault when:**

| Event | Update |
|-------|--------|
| Bug found + fixed | `vault/bugs/BUGLOG.md` — prepend `BUG-NNN` |
| Architecture/tech decision | `vault/adr/ADR-NNN-title.md` + update `vault/adr/README.md` |
| Product/UX decision | `vault/decisions/DECISIONS.md` — prepend `DEC-NNN` |
| Phase task completed | `vault/plans/PHASES.md` — check off item |
| Non-obvious fact discovered | `vault/context/CONTEXT.md` — prepend dated note |

Search for existing entries before adding — update in-place if related entry exists.

## Language & Files
- TypeScript only — no `.jsx` files for new components
- Imports: always use `@/` alias, never relative `../../../`
- No `console.log` in committed code

## Styling
- Tailwind classes only — no inline styles
- New feature CSS: one scoped `.css` file with a wrapper class (e.g. `.analytics-scope`)
- `src/index.css` `:root` / `.light` token blocks and `tailwind.config.ts` theme tokens — **ask before touching**. If user confirms, proceed. If no answer or user says no, don't touch.

## Components & Architecture

**DRY + KISS always.** If two places render the same UI — extract a component. No exceptions.

- If identical JSX appears twice → extract to a shared component before finishing
- Prefer small, single-purpose components over large monoliths
- Props over duplication — parameterize differences, share the base
- Use existing shadcn from `src/components/ui/` — don't add new primitives without asking
- New page components → `src/pages/`
- New shared components → `src/components/`
- Feature-specific components → `src/components/<feature>/`
- If a component exceeds ~150 lines, consider splitting it

## UI Verification (Playwright — When Required)

Run Playwright verification only when the change could affect other components:
- Modified a shared component (`src/components/ui/`, `src/components/layout/`)
- Changed global CSS, tokens, or Tailwind config
- Edited `App.tsx`, routing, or a context/hook used across pages
- Unsure if change is truly isolated

When running: take screenshot of changed route + 3 other routes, check browser console for errors (zero allowed). Use `npx playwright test --headed` or write a quick inline script.

Skip Playwright for: isolated single-page changes with no shared dependencies.

**Non-regression rule:** If your change accidentally breaks another page's layout or styling — fix it before committing. You touched it, you own it.

## Shell (ASK BEFORE TOUCHING)

Shell files are load-bearing — every page depends on them. Don't touch without explicit user confirmation in the current conversation. If user says no or doesn't answer, leave alone.

- `src/components/layout/Sidebar.tsx`
- `src/components/layout/TopNav.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/components/layout/AppSidebar.tsx`
- `src/components/layout/RoleSidebar.tsx`
- `src/components/layout/nav-data.ts`
- `src/App.tsx` routes — adding new routes is fine; reorder/remove needs confirmation

When user confirms a shell change: run Playwright regression on changed route + 3 unrelated routes before reporting done.
