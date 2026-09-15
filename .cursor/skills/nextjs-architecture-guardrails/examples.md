# Placement Examples

## Example 0: Featured Work Refactor Pilot

- Situation: Home page block, service page, and work listing all render variations of work cards.
- Decision:
  - Shared presentational pieces in `frontend/app/components/work/`.
  - Page-builder block and route files remain thin wrappers for context-specific composition.
  - Source-specific shape mapping stays in mapper utilities, not shared card/grid components.

## Example 1: Shared Card UI Across Routes

- Situation: Home, service, and listing pages render the same card style.
- Placement:
  - Shared card and grid in `frontend/app/components/<domain>/`.
  - Page/block wrappers choose variants and pass mapped data.
  - Mappers live in `frontend/app/lib/<domain>/` or `frontend/sanity/lib/`.

## Example 2: Route-Specific One-Off Section

- Situation: A section appears on one route only and has route-specific fetch/composition.
- Placement:
  - Keep implementation inside that route segment.
  - Extract only after a second real usage appears.

## Example 3: Promote To Features

- Situation: A domain now includes shared state orchestration, server actions, and cross-route hooks.
- Placement:
  - Promote workflow logic to `frontend/app/features/<domain>/`.
  - Keep presentational components in `frontend/app/components/<domain>/`.
  - Document why promotion was needed.
