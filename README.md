# Electrify — Frontend

Electrify is a Next.js (App Router) frontend that helps users discover electric vehicle incentives and related resources.

This repository contains the UI, client logic, and small server-side actions (OTP/login flows). The project uses a server-first approach: pages are implemented as server components where possible and interactive pieces are split into client components.

---

## Quick start

Recommended package manager: npm (this project is compatible with npm; pnpm is also supported).

Install dependencies:

```bash
npm install
# or (optional)
pnpm install
```

Run the development server (Turbopack enabled):

```bash
npm run dev
# or (optional)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Run linting:

```bash
npm run lint
# or
pnpm lint
```

Build for production:

```bash
npm run build
npm run start
# or (optional)
pnpm build
pnpm start
```

---

## Project snapshot (key info)

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS (shadcn UI primitives)
- Mapbox GL (maps), GSAP (animations), Lucide (icons)

Primary scripts (in package.json):

- dev: `next dev --turbopack`
- build: `next build --turbopack`
- start: `next start`
- lint: `eslint`

This project is tested with npm; equivalent pnpm commands are shown above as an alternative.

---

## Architecture & Patterns

- Server-first pages: most pages are authored as server components (fast SSR), with interactive parts implemented as client components (`"use client"` or dynamic imports).
- UI primitives: shadcn components and Tailwind semantic tokens are used for consistent light/dark theming (e.g. `text-foreground`, `bg-background`, `border-input`).
- Centralized utilities: backend URL construction and environment-specific behaviors are centralized in `src/lib/utils.ts` (e.g., conditional `teamId` appending in development).
- Cookie and auth flows: OTP verification is implemented as a server action that parses backend responses and sets cookies (see `src/app/login/actions.ts`).

---

## Important files & directories

- `src/app/` — Next.js App Router pages and layouts. Notable files:
  - `src/app/layout.tsx` — Root layout, theme provider, and Toaster. (See `ThemeProvider` and `UserProvider` usage.)
  - `src/app/(home)/page.tsx` — Landing page (server component) that imports client components for interactive elements.

- `src/components/` — UI components and shadcn primitives. Subfolders:
  - `home/` — `NavbarClient.tsx`, `HeroClient.tsx` (client components for landing page interactions)
  - `dashboard/` — admin/dashboard UI pieces
  - `shared/` — shared utilities and UI (e.g., theme-provider, purpose-warning)
  - `ui/` — shadcn-style primitive components used across the app

- `src/lib/` — helpers and utility code (e.g., `getBackendUrl`).
- `public/assets/images/` — static images used by the site.

---

## Environment variables

Create a `.env.local` at the project root for local config. Typical environment variables used or referenced in code:

- `NEXT_PUBLIC_BACKEND_URL` — base URL for the backend API (frontend calls).
- `TEST_TEAM_ID` — optional team id used in development to append to backend requests (used by `getBackendUrl`).
- `NODE_ENV` — standard Node environment flag (`development`, `production`).

Note: code in `src/lib/utils.ts` may append `teamId` to backend queries when `NODE_ENV === 'development'` or when `TEST_TEAM_ID` is set. Inspect that helper before changing API behavior.

---

## Theming and UI

- The app uses Tailwind CSS with shadcn UI primitives and semantic tokens to ensure components look correct in light and dark themes.
- Root layout (`src/app/layout.tsx`) wires up a `ThemeProvider` and `Toaster` (sonner).

---

## Development notes & tips

- Prefer server components for pages and move interactivity into client components. This keeps bundles smaller and improves initial performance.
- Use Suspense for heavy browser-only libraries (Mapbox GL, GSAP).
- Keep backend URL logic centralized and avoid scattering team-specific query params across components.

Recommended commands summary:

```bash
# install
npm install

# dev
npm run dev

# build
npm run build
npm run start

# lint
npm run lint

# optional (pnpm users)
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm lint
```

---

## Contributing

1. Fork the repo and create a feature branch.
2. Follow the existing component patterns: server components in `src/app`, client interactivity in `src/components/*` with `"use client"`.
3. Run linting and TypeScript checks before opening a PR.

If you want me to add a small CONTRIBUTING.md, tests, or CI configuration (GitHub Actions), tell me which CI provider and I will scaffold it.

---

## License

This repository does not include an explicit license file. If you want to make the repository open-source, add a LICENSE file (MIT is a common choice).

---

If you'd like I can:

- add a short CONTRIBUTING.md and ISSUE_TEMPLATE
- add a recommended `.env.example` with likely variables
- open a PR that fixes any of the known lint/type blockers

Tell me which of the above you want next and I will implement it.
