# Electrify Frontend - AI Agent Guidelines

## 🏗️ Architecture Overview

**Next.js App Router + TypeScript + Server-First Approach**

- Pages default to server components (SSR) with client components marked `"use client"`
- Feature-based organization: `src/features/{domain}/` contains domain logic
- Shared UI components in `src/components/ui/` (shadcn/ui primitives)
- Server actions in `src/features/*/services/` with custom `useServerAction` hook

## 🔐 Authentication Patterns

**JWT-based with automatic refresh tokens**

- Server-side: `getUser()` from `src/lib/auth/auth-server.ts`
- Client-side: JWT stored in httpOnly cookies
- Refresh logic: `performTokenRefresh()` handles token renewal
- Always check `user.role` for authorization (admin vs driver)

```typescript
// Server component auth check
const { user, token } = await getUser();
if (!user) redirect("/login");

// API calls include token
const response = await fetch(url, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## 🎯 Form Handling & Server Actions

**Custom `useServerAction` hook replaces `useActionState`**

- Located: `src/hooks/use-server-action.ts`
- Provides consistent error/success handling across forms
- Always use this instead of `useActionState` directly

```typescript
// ✅ Correct pattern
const { state, execute, pending } = useServerAction(
  handleFormAction,
  { success: false, msg: "" },
  {
    onSuccess: (state) => toast.success(state.msg),
    onError: (state) => toast.error(state.msg)
  }
);

// Form submission
<form action={action} onSubmit={(e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  execute(formData);
}}>
```

## ⚡ Real-Time Features (Ably)

**Ably integration for live charging updates**

- Context: `src/features/charging/contexts/binding-context.tsx`
- Dynamic imports required: `import dynamic from "next/dynamic"`
- Channel naming: `{sessionId}-{channelId}` pattern

```typescript
// ✅ SSR-compatible Ably usage
const ChargingProgress = dynamic(
  () => import("@/features/charging/components/progress"),
  { ssr: false },
);

// Context provides Ably client + channel
const { publish } = useChannel(channelId, (message) => {
  if (message.name === "soc_update") {
    setProgress(message.data.soc);
  }
});
```

## 🎨 UI & Styling Patterns

**shadcn/ui + Tailwind semantic tokens**

- Component registry: `components.json` with custom registries
- Always use semantic colors: `text-foreground`, `bg-background`, `border-input`
- Icon library: Lucide React (`lucide-react`)

```typescript
// ✅ Semantic color usage
<div className="bg-background text-foreground border border-input">
  <Button variant="default">Click me</Button>
</div>
```

## 📦 Package Management

**pnpm enforced, npm compatible**

- Scripts use pnpm commands
- `preinstall` hook prevents npm/yarn usage
- Turbopack enabled: `next dev --turbopack`

## 🔧 Development Workflow

**Essential commands:**

```bash
# Development (with Turbopack)
pnpm run dev

# Testing
pnpm run test:e2e              # Run all E2E tests
pnpm run test:e2e:headed       # Run with browser UI
pnpm run test:e2e:debug        # Debug mode

# Code quality
pnpm run lint                  # ESLint check
pnpm run build                 # Production build
```

## 🌐 API Integration

**Backend communication patterns:**

- Base URL: `https://api.go-electrify.com/api/v1`
- Always include auth token: `Authorization: Bearer ${token}`
- Server actions handle API calls and redirects
- Error handling: Check `response.ok` before parsing JSON

```typescript
// ✅ API call pattern
const response = await fetch(`${API_BASE_URL}/endpoint`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message);
}
```

## 🚨 Common Pitfalls

- **Don't use `useActionState` directly** - always use `useServerAction` wrapper
- **Ably components need `dynamic` imports** - SSR incompatible
- **Server components can't use client hooks** - split components appropriately
- **Always check user auth** - server-side auth validation required
- **Use semantic colors** - avoid hardcoded Tailwind colors
- **Feature-based organization** - keep domain logic in `src/features/`

## 📋 Code Style Notes

- **File naming**: kebab-case for files, PascalCase for components
- **Imports**: Use `@/` path aliases consistently
- **Error handling**: Server actions return `{ success, msg, data }` pattern
- **Zod schemas**: Validation in `src/lib/zod/` directory
- **Environment**: Check `NODE_ENV` for development-specific behavior</content>
  <parameter name="filePath">/home/lenovo/go-electrify-frontend/.github/copilot-instructions.md
