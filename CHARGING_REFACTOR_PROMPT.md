# Charging Pages Refactor - Complete Implementation Guide

## 🎯 Objective

Refactor charging-related pages to separate conditional stages into dedicated pages for better maintainability, scalability, and future-proofing.

## 📋 Current State Analysis

### Affected Pages with Conditional Stages:

1. **`/dashboard/charging/binding/page.tsx`**
   - **Issue**: Uses `join-page-wrapper.tsx` with conditional rendering based on `binding.currentStep`
   - **Current Stages**:
     - `"binding"` → Shows `BookingBinding` component (booking selection & binding)
     - `"charging"` → Shows `BindingActivePanel` component (active charging session)

2. **`BindingActivePanel` component** (`/features/charging/components/binding-active-panel.tsx`)
   - **Issue**: Single component handling multiple charging states
   - **Conditional Logic**:
     - Loading states, session starting (5-second window), active charging, completion
     - Different button states and UI based on `messages.length`, `isStartingSession`, `sessionStarted`

### Other Charging Pages (No Changes Needed):

- **`/dashboard/charging/page.tsx`**: Single stage (join code input) ✅
- **`/dashboard/charging/success/page.tsx`**: Single stage ✅
- **`/dashboard/charging-history/page.tsx`**: Single stage ✅

## 🏗️ Proposed New Architecture

### New Folder Structure:

```
src/app/(app-layout)/dashboard/(driver)/charging/
├── page.tsx                           # Start charging (join)
├── binding/
│   ├── page.tsx                       # Booking binding stage
│   └── progress/
│       └── page.tsx                   # Active charging progress
├── success/
│   └── page.tsx                       # Completion success
└── history/
    └── page.tsx                       # Charging history
```

### Page Responsibilities:

1. **`/charging/page.tsx`** (Start Charging)
   - QR/manual join code input
   - Server action redirects to `/charging/binding?sessionId=...&ablyToken=...`

2. **`/charging/binding/page.tsx`** (Binding Stage)
   - Booking selection and binding form
   - Car information loading and display
   - Server action redirects to `/charging/binding/progress?sessionId=...`

3. **`/charging/binding/progress/page.tsx`** (Progress Stage)
   - Real-time charging progress with Ably
   - Session start/stop controls
   - **Self-contained**: Reconstructs state from URL params
   - Redirects to `/charging/success` on completion

4. **`/charging/success/page.tsx`** (Success)
   - Completion confirmation
   - Payment/transaction details

## 🔧 Implementation Plan

### Phase 1: Create New Page Structure

1. Create `/charging/binding/progress/page.tsx`
2. Create `/charging/binding/page.tsx` (refactored from current binding page)
3. Update routing in server actions

### Phase 2: Extract Components and Logic

1. **Extract `BindingActivePanel` logic** into progress page
2. **Extract `BookingBinding` logic** into binding page
3. **Create shared hooks** for common functionality

### Phase 3: Update Navigation Flow

1. Modify server actions to redirect to new URLs
2. Update any hardcoded navigation
3. Test end-to-end flow

## 📦 Shared Logic Extraction

### Custom Hooks to Create:

```tsx
// hooks/use-charging-session.ts
export function useChargingSession(sessionId: string) {
  // Server-side: fetch session data
  // Client-side: handle real-time updates
}

// hooks/use-car-information.ts
export function useCarInformation(channelId: string) {
  // Handle car info loading and Ably updates
}

// hooks/use-charging-progress.ts
export function useChargingProgress(channelId: string) {
  // Handle SOC updates, session state, completion
}
```

### Server Actions (Keep Existing):

- `handleJoin` → redirects to `/charging/binding`
- `handleBindBooking` → redirects to `/charging/binding/progress`

## ⚙️ SSR and Dynamic Imports Strategy

### SSR by Default:

- **Server Pages**: `/charging/binding/page.tsx`, `/charging/success/page.tsx`
- **Fetch data server-side** using `searchParams`

### Dynamic Imports (No SSR):

- **`/charging/binding/progress/page.tsx`** - Requires Ably WebSocket connection

```tsx
import dynamic from "next/dynamic";

const ChargingProgressPage = dynamic(() => import("./progress/page"), {
  ssr: false,
  loading: () => <div>Loading charging progress...</div>,
});
```

## 🔗 URL-based State Management

Replace client-side context with URL parameters:

```
/charging/binding/progress?sessionId=abc123&ablyToken=xyz789&channelId=channel_123&expiresAt=1234567890
```

Each page fetches required data server-side:

```tsx
// /charging/binding/progress/page.tsx
export default async function ChargingProgressPage({
  searchParams,
}: {
  searchParams: Promise<{
    sessionId?: string;
    ablyToken?: string;
    channelId?: string;
    expiresAt?: string;
  }>;
}) {
  const params = await searchParams;
  const sessionData = await getChargingSession(params.sessionId!);

  return (
    <ChargingProgressClient
      sessionData={sessionData}
      ablyToken={params.ablyToken!}
      channelId={params.channelId!}
      expiresAt={params.expiresAt!}
    />
  );
}
```

## 🚀 Implementation Steps

### Step 1: Create Progress Page Structure

```bash
mkdir -p src/app/\(app-layout\)/dashboard/\(driver\)/charging/binding/progress
touch src/app/\(app-layout\)/dashboard/\(driver\)/charging/binding/progress/page.tsx
```

### Step 2: Extract BindingActivePanel Logic

- Move charging progress UI to new progress page
- Extract session start/stop logic
- Handle Ably real-time updates

### Step 3: Refactor Binding Page

- Move BookingBinding component logic to binding page
- Remove conditional rendering wrapper
- Update to use server-side data fetching

### Step 4: Create Shared Hooks

- `useChargingSession`: Session data management
- `useCarInformation`: Car info and Ably updates
- `useChargingProgress`: Progress tracking and completion

### Step 5: Update Server Actions

```tsx
// In charging-actions.ts
redirectUrl = `/dashboard/charging/binding/progress?sessionId=${data.sessionId}&ablyToken=${data.token}&channelId=${data.channelId}&expiresAt=${data.expiresAt}`;
```

### Step 6: Update Navigation

- Update any redirects in components
- Ensure proper URL parameter passing
- Test all navigation flows

## 🧪 Testing Strategy

### Unit Tests:

- Test each page component in isolation
- Test custom hooks with mocked data
- Test server actions with different scenarios

### Integration Tests:

- Test complete charging flow: join → bind → progress → success
- Test error scenarios and edge cases
- Test URL parameter handling

### E2E Tests:

- Update Playwright tests for new page structure
- Test real-time updates and WebSocket connections
- Test navigation and state persistence

## 📋 Migration Checklist

- [ ] Create new page files with proper structure
- [ ] Extract and move component logic
- [ ] Create shared hooks and utilities
- [ ] Update server action redirects
- [ ] Update any hardcoded navigation paths
- [ ] Test all user flows end-to-end
- [ ] Update Playwright tests
- [ ] Verify SSR compatibility
- [ ] Test error handling and edge cases
- [ ] Performance test with real-time updates

## 💡 Key Benefits

- **Self-contained pages**: Each stage can be accessed/bookmarked independently
- **Better maintainability**: One responsibility per page/component
- **Future-proof**: Easy to add new stages or modify existing ones
- **SSR compatibility**: Clear separation of server vs client needs
- **Persistent progress**: Users can return to charging progress anytime
- **Better testing**: Isolated components and pages are easier to test

## 🔍 Technical Considerations

### Ably Integration:

- Use `dynamic` imports for pages requiring Ably
- Handle connection errors gracefully
- Implement reconnection logic

### State Management:

- Prefer URL params over client-side context for page state
- Use server-side data fetching where possible
- Keep client components lightweight

### Error Handling:

- Implement proper error boundaries
- Handle network failures and WebSocket disconnections
- Provide user-friendly error messages

### Performance:

- Optimize server-side data fetching
- Minimize client-side bundle size
- Implement proper loading states

---

## 🎯 Success Criteria

- [ ] All charging stages are in separate pages
- [ ] Each page can be accessed directly via URL
- [ ] Real-time charging progress persists on page refresh
- [ ] SSR works correctly for appropriate pages
- [ ] All existing functionality preserved
- [ ] Improved maintainability and testability
- [ ] No breaking changes to user experience

---

## 📝 Implementation Notes

- Start with creating the new page structure
- Extract logic incrementally to avoid breaking changes
- Test each step thoroughly before moving to the next
- Keep commits small and focused
- Update documentation as you go

This refactor will significantly improve the codebase maintainability while preserving all existing functionality.</content>
<parameter name="filePath">/home/lenovo/go-electrify-frontend/CHARGING_REFACTOR_PROMPT.md
