# Electrify — Frontend

Electrify is a Next.js (App Router) frontend that serves as a charger platform helping drivers charge their electric cars easier, while enhancing the management experience for staffs.

This repository contains the UI, client logic, and small server-side actions (OTP/login flows). The project uses a server-first approach: pages are implemented as server components where possible and interactive pieces are split into client components.

---

## Quick start

Recommended package manager: npm (this project is compatible with npm; pnpm is also supported).

Install dependencies:

```bash
npm install
```

Run the development server (Turbopack enabled):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Run linting:

```bash
npm run lint
```

Build for production:

```bash
npm run build
npm run start
```

---

## Project snapshot (key info)

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS (shadcn UI primitives)
- Mapbox GL (maps), GSAP (animations), Lucide (icons)
- Data Mocking with Requestly
- Zod validation

Primary scripts (in package.json):

- dev: `next dev --turbopack`
- build: `next build --turbopack`
- start: `next start`
- lint: `eslint`

This project is tested with npm; equivalent pnpm commands are shown above as an alternative.

---

## Architecture & Patterns

- Server-first pages: most pages are declared as server components (SSR) by default, with interactive parts implemented as client components (`"use client"` or dynamic imports).
- UI primitives: shadcn components and Tailwind semantic tokens are used for consistent light/dark theming (e.g. `text-foreground`, `bg-background`, `border-input`).

---

## Environment variables

Create a `.env.local` at the project root for local config. Typical environment variables used or referenced in code:

- `NEXT_PUBLIC_BACKEND_URL` — base URL for the backend API (frontend calls).
- `TEST_TEAM_ID` — optional team id used in development to append to backend requests (used by `getBackendUrl`).
- `NODE_ENV` — standard Node environment flag (`development`, `production`).

Note: code in `src/lib/utils.ts` may append `teamId` to backend queries when `NODE_ENV === 'development'` or when `TEST_TEAM_ID` is set. Inspect that helper before changing API behavior.
