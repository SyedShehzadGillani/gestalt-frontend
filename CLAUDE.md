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

## Components
- Use existing shadcn from `src/components/ui/` — don't add new primitives without asking
- New page components go in `src/pages/`
- New shared components go in `src/components/`
- Feature-specific components go in `src/components/<feature>/`

## Shell (NEVER TOUCH)
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/TopNav.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/components/layout/nav-data.ts`
- `src/App.tsx` routes — only add, never reorder or remove existing routes
