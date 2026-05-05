# gestalt-react — React Code Rules

## Language & Files
- TypeScript only — no `.jsx` files for new components
- Imports: always use `@/` alias, never relative `../../../`
- No `console.log` in committed code

## Styling
- Tailwind classes only — no inline styles
- New feature CSS: one scoped `.css` file with a wrapper class (e.g. `.analytics-scope`)
- Never modify `src/index.css` `:root` or `.light` token blocks
- Never modify `tailwind.config.ts` theme tokens without asking

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

## UI Verification (Required After Every Visual Change)

After any UI change, verify in browser using Playwright:
1. `npx playwright test --headed` — or write a quick inline script if no test exists
2. Take a screenshot of the changed route and visually confirm it looks correct
3. Navigate to 3 other existing routes and screenshot — confirm nothing broke
4. Check browser console for errors (`page.on('console')`) — zero errors allowed

**Non-regression rule:** Any UI change must leave all other components, pages, and styles untouched. If a change accidentally breaks another page's layout or styling — fix it before committing, even if the breakage was pre-existing. You touched it, you own it.

Playwright is the tool — not Puppeteer. It's already installed in this project.

## Shell (NEVER TOUCH)
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/TopNav.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/components/layout/nav-data.ts`
- `src/App.tsx` routes — only add, never reorder or remove existing routes
