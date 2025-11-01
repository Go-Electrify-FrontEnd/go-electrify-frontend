# Charging Flow Architecture

## Before Refactor

```
┌─────────────────────────────────────────┐
│  /charging/binding/page.tsx             │
│  (Server Component)                     │
└──────────────┬──────────────────────────┘
               │
               v
┌─────────────────────────────────────────┐
│  JoinPageWrapperNoSSR                   │
│  (Dynamic Import Wrapper)               │
└──────────────┬──────────────────────────┘
               │
               v
┌─────────────────────────────────────────┐
│  JoinPageWrapper                        │
│  (Client Component with BindingContext) │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       v               v
┌────────────┐  ┌────────────────┐
│ Binding    │  │ Active Panel   │
│ Component  │  │ Component      │
└────────────┘  └────────────────┘
(Conditional rendering based on currentStep)
```

**Issues:**

- ❌ Conditional rendering in single page
- ❌ No URL-based routing for stages
- ❌ Complex context management
- ❌ Can't access stages directly
- ❌ State lost on refresh

## After Refactor

```
┌─────────────────────────────────────────────────────┐
│          Charging Flow (Separate Pages)             │
└─────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 1. /charging/page.tsx                                    │
│    Start Charging (Join)                                 │
│    [Server Component]                                    │
│    - QR Scanner / Manual Input                           │
│    - handleJoin() server action                          │
└────────────┬─────────────────────────────────────────────┘
             │ Redirects with params:
             │ ?sessionId=...&ablyToken=...&channelId=...
             v
┌──────────────────────────────────────────────────────────┐
│ 2. /charging/binding/page.tsx                            │
│    Booking Binding Stage                                 │
│    [Server Component → BookingBindingWrapper]            │
│    ├─ Fetches reservations (SSR)                         │
│    ├─ Validates URL params                               │
│    └─ Dynamic import BookingBindingClient (CSR)          │
│        ├─ Ably connection for car info                   │
│        ├─ Booking selection form                         │
│        ├─ Target SOC input                               │
│        └─ handleBindBooking() server action              │
└────────────┬─────────────────────────────────────────────┘
             │ Redirects with params:
             │ ?sessionId=...&ablyToken=...&channelId=...
             v
┌──────────────────────────────────────────────────────────┐
│ 3. /charging/binding/progress/page.tsx                   │
│    Active Charging Progress                              │
│    [Server Component → ChargingProgressWrapper]          │
│    ├─ Fetches session data (SSR)                         │
│    ├─ Validates URL params                               │
│    └─ Dynamic import ChargingProgressClient (CSR)        │
│        ├─ Ably connection for real-time updates          │
│        ├─ SOC progress display                           │
│        ├─ Start/Stop controls                            │
│        └─ Auto-redirect on completion                    │
└────────────┬─────────────────────────────────────────────┘
             │ Auto redirect on
             │ charging_complete event
             v
┌──────────────────────────────────────────────────────────┐
│ 4. /charging/success/page.tsx                            │
│    Charging Complete                                     │
│    [Server Component]                                    │
│    - Payment details                                     │
│    - Session summary                                     │
└──────────────────────────────────────────────────────────┘
```

## Component Structure

```
Server Components (SSR)
├── /charging/binding/page.tsx
│   └── Fetches: reservations
│       └── Wraps: BookingBindingWrapper
│
└── /charging/binding/progress/page.tsx
    └── Fetches: session data
        └── Wraps: ChargingProgressWrapper

Client Wrappers (Dynamic Import with ssr: false)
├── BookingBindingWrapper
│   └── Dynamic import: BookingBindingClient
│
└── ChargingProgressWrapper
    └── Dynamic import: ChargingProgressClient

Client Components (Ably Integration)
├── BookingBindingClient
│   ├── AblyProvider
│   ├── ChannelProvider
│   └── BookingBindingInner
│       ├── Listen: car_information
│       ├── Publish: load_car_information
│       └── Submit: handleBindBooking()
│
└── ChargingProgressClient
    ├── AblyProvider
    ├── ChannelProvider
    └── ChargingProgressInner
        ├── Listen: soc_update, charging_complete
        ├── Publish: start_session
        └── Auto-redirect on complete
```

## State Management

### Before (Context-Based)

```
BindingContext
├── ablyToken
├── channelId
├── sessionId
├── expiresAt
├── booking (object)
├── currentStep ("binding" | "charging")
└── setCurrentStep()
```

❌ Lost on refresh  
❌ Not shareable via URL  
❌ Complex state management

### After (URL-Based)

```
URL Query Parameters
├── /charging/binding
│   ?sessionId=...
│   &ablyToken=...
│   &channelId=...
│   &expiresAt=...
│
└── /charging/binding/progress
    ?sessionId=...
    &ablyToken=...
    &channelId=...
    &expiresAt=...
```

✅ Persists on refresh  
✅ Shareable/bookmarkable  
✅ Server can validate params  
✅ Simple and predictable

## Key Benefits

| Aspect                | Before                       | After                   |
| --------------------- | ---------------------------- | ----------------------- |
| **Navigation**        | Context state changes        | URL-based routing       |
| **State Persistence** | Lost on refresh              | URL parameters          |
| **Bookmarking**       | Not possible                 | Full support            |
| **Testing**           | Complex (context mocking)    | Simple (URL params)     |
| **Maintainability**   | Conditional rendering        | Separate pages          |
| **SSR**               | Partial (wrapper complexity) | Full support            |
| **Type Safety**       | Runtime checks               | TypeScript + validation |
