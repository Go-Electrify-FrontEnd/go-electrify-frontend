# E2E Test Setup Guide

This guide explains how to run the E2E tests locally.

## Prerequisites

1. **Node.js** (v20 or later)
2. **pnpm** (v8 or later)
3. **Playwright browsers**

## Setup Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

The `.env` file should contain:
```
AUTH_SECRET_KEY=test-secret-key-for-testing-only-change-in-production
NODE_ENV=test
BACKEND_URL=http://localhost:8080/api/v1
NEXT_FONT_GOOGLE_FALLBACK=true
```

### 3. Install Playwright Browsers

```bash
pnpm exec playwright install chromium
```

Or install all browsers:
```bash
pnpm exec playwright install
```

## Running Tests

### Run all E2E tests
```bash
pnpm run test:e2e
```

### Run specific test file
```bash
pnpm run test:e2e src/app/test/admin-users.copi-gen.spec.ts
```

### Run tests with UI
```bash
pnpm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
pnpm run test:e2e:headed
```

### Debug tests
```bash
pnpm run test:e2e:debug
```

### Run tests for a specific project (browser)
```bash
pnpm run test:e2e --project=chromium
```

## Test Files

All E2E tests are located in `src/app/test/` and follow the naming pattern `*.copi-gen.spec.ts`:

### Admin Pages
- `admin-users.copi-gen.spec.ts` - User management tests
- `admin-stations.copi-gen.spec.ts` - Station management tests
- `admin-booking-fee.copi-gen.spec.ts` - Booking fee configuration tests
- `admin-vehicle-models.copi-gen.spec.ts` - Vehicle model management tests
- `admin-connector-type.copi-gen.spec.ts` - Connector type management tests
- `admin-subscriptions.copi-gen.spec.ts` - Subscription management tests
- `admin-incident-reports.copi-gen.spec.ts` - Incident report management tests

### Driver Pages
- `driver-reservations.copi-gen.spec.ts` - Reservation management tests
- `driver-wallet.copi-gen.spec.ts` - Wallet and transactions tests
- `driver-plans-billing.copi-gen.spec.ts` - Subscription plans and billing tests
- `driver-settings.copi-gen.spec.ts` - User settings tests

### Staff Pages
- `staff-deposit-customers.copi-gen.spec.ts` - Customer deposit tests
- `staff-incident-reports.copi-gen.spec.ts` - Staff incident reporting tests

### Common Pages
- `notifications.copi-gen.spec.ts` - Notifications dashboard tests
- `station-detail.copi-gen.spec.ts` - Station detail page tests

## How Tests Work

- **Authentication**: Tests use JWT tokens (via `jose` library) to mock authentication without real email flow
- **API Mocking**: All API calls are intercepted using Next.js `testProxy` and `next.onFetch`
- **Offline Testing**: Tests run completely offline with deterministic results
- **No External Dependencies**: No real backend or email services required

## Troubleshooting

### Browsers Not Installed
If you see an error about browsers not being installed:
```bash
pnpm exec playwright install chromium
```

### Font Loading Warnings
Font loading warnings are expected and don't affect test execution. They occur because tests run offline.

### Port Already in Use
If the test server port is already in use, kill the process using that port or change the port in `playwright.config.ts`.

### Authentication Errors
Make sure your `.env` file has the `AUTH_SECRET_KEY` set. This is required for JWT token generation in tests.

## CI/CD

Tests automatically run in CI/CD with the same setup. The `.env` file is created automatically in CI using the example file.
