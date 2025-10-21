# Refactor notes — feature-based migration

This repository has been migrated incrementally to a feature-based layout.

Stations feature

- Implementation moved to `src/features/stations`:
  - `services/` — server actions and API helpers
  - `components/` — feature UI components (tables, dialogs, actions)
  - `contexts/` — feature-local contexts (e.g. charger-update-context)

Shims

- The original files under `src/components/dashboard/stations` and
  `src/actions/stations-actions.ts` were replaced with small compatibility
  shims that re-export the implementations from the new feature locations.
  This keeps imports working during migration.

Next steps (recommended)

1. Run the provided migration script to update import statements across the
   repository (it will create .bak backups):

   node ./scripts/refactor/migrate-station-imports.js

2. Run `pnpm build` and `pnpm test` locally; fix any issues reported.
3. Once all imports point to feature paths and CI/test pass, remove the
   compatibility shims in a small PR.
4. Repeat for other features (users, bookings, wallets, etc.).

If you'd like, I can:

- Run the migration script here (requires node available in the environment).
- Continue migrating the next feature (suggested: users or bookings).
