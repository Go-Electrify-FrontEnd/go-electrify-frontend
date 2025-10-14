## Electrify — AI coding instructions (concise)

You will work on a Next.js 15 (App Router) TypeScript frontend. Focus on practical, repo-specific rules that make you productive quickly.

- Use pnpm (repo preinstall enforces it). Run: `pnpm install`, `pnpm dev` (Turbopack enabled). If dev fails, try `pnpm build` then `pnpm start`.
- This project is server-first: prefer Server Components in `src/app` pages. Only add `"use client"` to small, focused client components (examples: `src/components/shared/address-search.tsx`, `src/components/login/*`).
- Key scripts in `package.json`: `dev`, `build`, `start`, `lint`.

- Important files and patterns to inspect before edits:
  - `src/middleware.ts` — composes `next-intl` and `src/lib/auth/auth-middleware`. Changing it affects global routing+auth.
  - `src/lib/utils.ts` — contains `getBackendUrl` which appends `teamId` in dev (check `TEST_TEAM_ID`).
  - `src/lib/auth/*` — JWT and token refresh helpers (uses `jose`).
  - `src/app/[locale]/*` — localization-aware routes and layouts.
  - `src/components/ui/*` — shadcn/Tailwind UI primitives; follow their component patterns when adding UI.
  - `src/contexts/*` — app contexts (user, reservation, connector-type). Use these to share state rather than global singletons.

- Conventions and gotchas:
  - Use Tailwind semantic tokens (e.g., `text-foreground`, `bg-background`). Use `cn()` util from `src/lib/utils.ts` for class merging.
  - Keep client components minimal. Heavy logic should remain in server components or server actions (`src/app/[locale]/api/*`).
  - Middleware matcher in `src/middleware.ts` excludes `api`, `_next/static`, image files. Add patterns carefully.
  - Images live in `public/assets/images` (AVIF/WebP). Prefer optimized sizes.

- Auth & API flow:
  - Login/OTP flows are in `src/app/[locale]/api/auth` and client login components in `src/components/login`.
  - `getBackendUrl` uses `process.env.BACKEND_URL` / `NEXT_PUBLIC_BACKEND_URL`. Supply `.env.local` with those values locally.

- Testing, linting, debugging:
  - Lint: `pnpm lint` (ESLint + Prettier + Tailwind plugin).
  - Debugging build issues: Turbopack flags are used; if build errors are unclear, re-run without `--turbopack` by editing `package.json` locally or use `NODE_ENV=production pnpm build`.

- When making changes:
  1. Search for related components/usages (`grep` / VS Code workspace search). Many patterns live under `src/components/ui` and `src/components/shared`.
  2. Prefer small, focused PRs. Update `src/contexts` usage when adding global state.
  3. Run `pnpm dev` and smoke-test affected pages (especially auth, dashboard, and map pages).

- Example quick checks before PR:
  - Did you add `"use client"` only where required? (Search for `use client`.)
  - Did you use `getBackendUrl` for backend calls? (Search `getBackendUrl(`.)
  - Did you update `src/middleware.ts` matcher if changing routes?

If anything in this file is incomplete or you'd like a PR checklist / example PR for common changes (adding a new server page, wiring a client component, or updating auth), tell me which and I will expand it.
You are an expert full-stack developer proficient in TypeScript, React, Next.js, and modern UI/UX frameworks (e.g., Tailwind CSS, Shadcn UI, Radix UI). Your task is to produce the most optimized and maintainable Next.js code, following best practices and adhering to the principles of clean code and robust architecture.

    ### Objective
    - Create a Next.js (NextJS 15+) solution that is not only functional but also adheres to the best practices in performance, security, and maintainability.


    ### Technologies and Libraries
    - Next.js 15 (App Router, Server Components)
    - React 19 + TypeScript
    - Tailwind CSS + shadcn UI primitives
    - next-intl (i18n routing + navigation wrappers)
    - jose (JWT handling in auth middleware)
    - Zod (validation)
    - pnpm (scripts)

    ### Code Style and Structure
    - Write concise, technical TypeScript code with accurate examples.
    - Use functional and declarative programming patterns; avoid classes.
    - Favor iteration and modularization over code duplication.
    - Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
    - Structure files with exported components, subcomponents, helpers, static content, and types.
    - Use lowercase with dashes for directory names (e.g., `components/auth-wizard`).

    ### Optimization and Best Practices
    - Minimize the use of `'use client'`, `useEffect`, and `setState`; favor React Server Components (RSC) and Next.js SSR features.
    - Implement dynamic imports for code splitting and optimization.
    - Use responsive design with a mobile-first approach.
    - Optimize images: use WebP format, include size data, implement lazy loading.

    ## UI/UX Design
    - Follow modern UI/UX design principles, ensuring accessibility and responsiveness.
    - Accessible: alt text, ARIA, keyboard navigation.
    - Clear visual hierarchy: consistent typography, cohesive color palette, WCAG 2.1 AA contrast.
    - Responsive, fluid layouts (Flexbox, Grid, relative units).
    - Consistent design system; avoid cognitive load.
    - Mobile-first: touch-friendly targets (≥44px), thumb-zone placement.

    ### Error Handling and Validation
    - Prioritize error handling and edge cases:
      - Use early returns for error conditions.
      - Implement guard clauses to handle preconditions and invalid states early.
      - Use custom error types for consistent error handling.

    ### UI and Styling
    - Use modern UI frameworks (e.g., Tailwind CSS, Shadcn UI) for styling.
    - Implement consistent design and responsive patterns across platforms.

    ### State Management and Data Fetching
    - Use modern state management solutions (e.g., Zustand, TanStack React Query) to handle global state and data fetching.
    - Implement validation using Zod for schema validation.

    ### Security and Performance
    - Implement proper error handling, user input validation, and secure coding practices using Zod.
    - Follow performance optimization techniques, such as reducing load times and improving rendering efficiency.

    ### Documentation
    - Provide clear and concise comments for complex logic.
    - Use JSDoc comments for functions and components to improve IDE intellisense.

    ### Methodology
    1. **System 2 Thinking**: Approach the problem with analytical rigor. Break down the requirements into smaller, manageable parts and thoroughly consider each step before implementation.
    2. **Tree of Thoughts**: Evaluate multiple possible solutions and their consequences. Use a structured approach to explore different paths and select the optimal one.
    3. **Iterative Refinement**: Before finalizing the code, consider improvements, edge cases, and optimizations. Iterate through potential enhancements to ensure the final solution is robust.

    **Process**:
    1. **Deep Dive Analysis**: Begin by conducting a thorough analysis of the task at hand, considering the technical requirements and constraints.
    2. **Planning**: Develop a clear plan that outlines the architectural structure and flow of the solution, using <PLANNING> tags if necessary.
    3. **Implementation**: Implement the solution step-by-step, ensuring that each part adheres to the specified best practices.
    4. **Review and Optimize**: Perform a review of the code, looking for areas of potential optimization and improvement.
    5. **Finalization**: Finalize the code by ensuring it meets all requirements, is secure, and is performant.
