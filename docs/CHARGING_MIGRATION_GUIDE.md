# Charging Refactor - Developer Migration Guide

## Overview

The charging flow has been refactored from a single page with conditional rendering to separate pages for each stage. This guide helps developers understand what changed and how to work with the new structure.

## What Changed?

### Old Structure (Deprecated)

```typescript
// ❌ OLD - No longer exists
/charging/binding/page.tsx
  └─ JoinPageWrapperNoSSR
      └─ JoinPageWrapper (with BindingContext)
          ├─ BookingBinding (if currentStep === "binding")
          └─ BindingActivePanel (if currentStep === "charging")
```

### New Structure (Current)

```typescript
// ✅ NEW - Separate pages
/charging/binding/page.tsx
  └─ BookingBindingWrapper
      └─ BookingBindingClient (with Ably)

/charging/binding/progress/page.tsx
  └─ ChargingProgressWrapper
      └─ ChargingProgressClient (with Ably)
```

## Deleted Files

The following files have been removed and should not be referenced:

- ❌ `src/features/charging/components/join-page-wrapper.tsx`
- ❌ `src/features/charging/components/join-no-ssr-wrapper.tsx`
- ❌ `src/features/charging/components/booking-binding.tsx`
- ❌ `src/features/charging/components/binding-active-panel.tsx`
- ❌ `src/features/charging/contexts/binding-context.tsx`

## New Files

### Server Components (Pages)

- ✅ `/charging/binding/page.tsx` - Binding stage server component
- ✅ `/charging/binding/progress/page.tsx` - Progress stage server component

### Client Components

- ✅ `booking-binding-client.tsx` - Binding form with Ably
- ✅ `booking-binding-wrapper.tsx` - Dynamic import wrapper
- ✅ `charging-progress-client.tsx` - Progress display with Ably
- ✅ `charging-progress-wrapper.tsx` - Dynamic import wrapper

## Migration Examples

### Example 1: Importing Components

**Before:**

```typescript
// ❌ OLD - Don't do this
import { BookingBinding } from "@/features/charging/components/booking-binding";
import { BindingActivePanel } from "@/features/charging/components/binding-active-panel";
```

**After:**

```typescript
// ✅ NEW - Use page routes instead
// Navigate to: /dashboard/charging/binding
// Navigate to: /dashboard/charging/binding/progress
```

### Example 2: Using Context

**Before:**

```typescript
// ❌ OLD - Don't do this
import { useBindingContext } from "../contexts/binding-context";

function MyComponent() {
  const { sessionId, channelId, setCurrentStep } = useBindingContext();
  // ...
}
```

**After:**

```typescript
// ✅ NEW - Use URL parameters
import { useSearchParams } from "next/navigation";

function MyComponent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const channelId = searchParams.get("channelId");
  // Navigation is handled by server actions, no setCurrentStep needed
}
```

### Example 3: Navigation Between Stages

**Before:**

```typescript
// ❌ OLD - Don't do this
const { setCurrentStep } = useBindingContext();
setCurrentStep("charging"); // Change displayed component
```

**After:**

```typescript
// ✅ NEW - Server actions handle redirects
// In server action:
redirect(`/dashboard/charging/binding/progress?sessionId=${sessionId}&...`);

// Or use router in client:
import { useRouter } from "next/navigation";
const router = useRouter();
router.push(`/dashboard/charging/binding/progress?sessionId=${sessionId}&...`);
```

## Working with the New Structure

### 1. Accessing Binding Stage

**URL:**

```
/dashboard/charging/binding?sessionId=abc&ablyToken=xyz&channelId=ch1&expiresAt=123
```

**What happens:**

1. Server component fetches user reservations (SSR)
2. Validates URL parameters
3. Passes data to `BookingBindingWrapper`
4. Client component connects to Ably
5. Loads car information
6. User submits binding form
7. Server action redirects to progress page

### 2. Accessing Progress Stage

**URL:**

```
/dashboard/charging/binding/progress?sessionId=abc&ablyToken=xyz&channelId=ch1&expiresAt=123
```

**What happens:**

1. Server component fetches session data (SSR)
2. Validates URL parameters
3. Passes data to `ChargingProgressWrapper`
4. Client component connects to Ably
5. Displays real-time charging progress
6. Auto-redirects to success page on completion

### 3. Adding New Features

#### To the Binding Stage:

**Edit:** `src/features/charging/components/booking-binding-client.tsx`

```typescript
function BookingBindingInner({ sessionId, channelId, ... }) {
  // Add your logic here
  // Access Ably via useChannel hook
  // Submit via handleBindBooking server action
}
```

#### To the Progress Stage:

**Edit:** `src/features/charging/components/charging-progress-client.tsx`

```typescript
function ChargingProgressInner({ sessionData, channelId }) {
  // Add your logic here
  // Access Ably via useChannel hook
  // Listen for real-time events
}
```

## URL Parameter Reference

All charging pages use these URL parameters:

| Parameter   | Type   | Required | Description                |
| ----------- | ------ | -------- | -------------------------- |
| `sessionId` | string | Yes      | Charging session ID        |
| `ablyToken` | string | Yes      | Ably authentication token  |
| `channelId` | string | Yes      | Ably channel name          |
| `expiresAt` | string | Yes      | Token expiration timestamp |

### Example URL:

```
/dashboard/charging/binding/progress?sessionId=550e8400-e29b-41d4-a716-446655440000&ablyToken=xVn3x...&channelId=session-123-channel&expiresAt=1730419200
```

## Ably Integration

### Channels and Events

**Binding Stage:**

- **Publish:** `load_car_information` - Request car battery info
- **Listen:** `car_information` - Receive car data

**Progress Stage:**

- **Publish:** `start_session` - Start charging with target SOC
- **Listen:**
  - `soc_update` - Real-time SOC percentage updates
  - `charging_complete` - Charging session completed

### Example Ably Usage:

```typescript
import { useChannel } from "ably/react";

const { publish } = useChannel(channelId, (message) => {
  if (message.name === "soc_update") {
    setProgress(message.data.soc);
  } else if (message.name === "charging_complete") {
    router.push("/dashboard/charging/success");
  }
});

// Publish event
publish("start_session", { targetSOC: 80 });
```

## Server Actions

### handleJoin (Unchanged)

Redirects to binding page with Ably credentials:

```typescript
redirect(
  `/dashboard/charging/binding?sessionId=...&ablyToken=...&channelId=...&expiresAt=...`,
);
```

### handleBindBooking (Updated)

Now redirects to progress page after successful binding:

```typescript
redirect(
  `/dashboard/charging/binding/progress?sessionId=...&ablyToken=...&channelId=...&expiresAt=...`,
);
```

## Testing

### Unit Tests

**Old approach (deprecated):**

```typescript
// ❌ Testing conditional rendering
test("shows BookingBinding when step is binding", () => {
  render(<JoinPageWrapper currentStep="binding" />);
});
```

**New approach:**

```typescript
// ✅ Test individual page components
test("binding page renders with valid params", async () => {
  const page = await BindingPage({
    searchParams: Promise.resolve({
      sessionId: "123",
      ablyToken: "token",
      channelId: "channel",
      expiresAt: "123456",
    }),
  });
  render(page);
});
```

### E2E Tests

Update Playwright tests to navigate between pages:

```typescript
// Navigate to binding
await page.goto("/dashboard/charging/binding?sessionId=...");

// Fill form and submit
await page.fill('[name="bookingCode"]', "BOOK123");
await page.fill('[name="targetSOC"]', "80");
await page.click('button[type="submit"]');

// Verify redirect to progress
await expect(page).toHaveURL(/\/charging\/binding\/progress/);
```

## Common Issues & Solutions

### Issue 1: "Cannot find module binding-context"

**Solution:** Remove any imports of the old context. Use URL parameters instead.

### Issue 2: "Module not found: @/features/charging/components/booking-binding"

**Solution:** Remove imports of old components. Navigate to pages via URLs.

### Issue 3: "ssr: false is not allowed in Server Components"

**Solution:** Use the wrapper components (`BookingBindingWrapper`, `ChargingProgressWrapper`) which handle dynamic imports in client components.

### Issue 4: "Ably connection fails on build"

**Solution:** Ensure you're using dynamic imports with `ssr: false` for all Ably-related components.

## Best Practices

1. **Always pass URL parameters forward** when navigating between charging pages
2. **Use server actions for navigation** to ensure consistent redirect behavior
3. **Handle missing parameters** by redirecting to 404 or showing error messages
4. **Test Ably connections** with proper token management
5. **Use TypeScript** to validate props and URL parameters

## Getting Help

- Review the implementation in `src/features/charging/components/`
- Check the architecture diagram in `docs/CHARGING_ARCHITECTURE.md`
- Read the summary in `docs/CHARGING_REFACTOR_SUMMARY.md`
- Ask the team if you have questions about specific components

## Rollback Plan (Emergency)

If critical issues arise, the old implementation is backed up in:

```
archive/refactor-backups/20251022T010719/
```

However, rebuilding with the old structure would require significant work as dependencies have been updated. Instead, focus on fixing issues in the new structure.
