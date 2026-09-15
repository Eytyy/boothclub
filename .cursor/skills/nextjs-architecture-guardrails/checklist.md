# Architecture Review Checklist

Use this checklist during refactors and before finalizing changes.

- [ ] Is data fetching/orchestration still in route scope?
- [ ] Is shared logic actually reused in 2+ surfaces?
- [ ] Are shared components presentational and data-source agnostic?
- [ ] Are source-specific shape mappings in `app/lib` or `sanity/lib`?
- [ ] Is the `components/<domain>` vs `features/<domain>` decision justified?
- [ ] Are `*.client.tsx` boundaries explicit and minimal?
- [ ] Was visual treatment preserved unless redesign was requested?
- [ ] Were duplicate/legacy files removed after migration?
