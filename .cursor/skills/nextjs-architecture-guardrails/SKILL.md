---
name: nextjs-architecture-guardrails
description: Applies architecture decisions for Next.js App Router projects. Use when handling shared component extraction, components vs features decisions, App Router architecture refactors, duplicated UI consolidation, or domain folder organization.
---

# Nextjs Architecture Guardrails

Use this skill when deciding where code should live during refactors or new feature work.

## Decision Tree

1. Is this logic only used by one route or block surface?
   - Yes -> keep it in route scope.
2. Is it reused presentation with minimal behavior?
   - Yes -> place in `frontend/app/components/<domain>/`.
3. Is it shared behavior/workflow (state orchestration, actions, cross-cutting hooks)?
   - Yes -> promote to `frontend/app/features/<domain>/` with explicit rationale.

## Placement Rules

- Route/block entry files own fetching, orchestration, and page-level composition.
- Shared presentational modules should not fetch data.
- Adapters/mappers should live in `frontend/app/lib/**` or `frontend/sanity/lib/**`.
- Shared UI consumes canonical view-model types, not raw CMS query output.

## Refactor Workflow

1. Identify duplicated logic/UI and list all call sites.
2. Define canonical data contract for reusable UI.
3. Add mapper/adapters for each source shape.
4. Extract shared module with minimal API.
5. Convert callers into thin wrappers where needed.
6. Remove dead/duplicate implementations.
7. Validate parity, types, and accessibility basics.

## Validation Checklist

- Route owns data fetch/orchestration.
- Shared UI remains presentational.
- No raw Sanity/CMS shape leaks into shared UI API.
- `*.client.tsx` boundaries are explicit.
- Visual treatment remains unchanged unless requested.

## Additional Resources

- For quick review checks, see [checklist.md](checklist.md).
- For concrete placement examples, see [examples.md](examples.md).
