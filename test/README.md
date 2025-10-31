# End-to-End Testing with Playwright and Mailosaur

This directory contains end-to-end tests for the Go-Electrify frontend application using Playwright and Mailosaur for email testing.

## Setup

### 1. Install Dependencies

All dependencies are already included in the project. The main packages are:
- `@playwright/test` - Playwright testing framework
- `mailosaur` - Mailosaur email testing client
- `dotenv` - Environment variable loading

### 2. Install Playwright Browsers

```bash
pnpm exec playwright install
```

### 3. Set up Mailosaur Account

1. Sign up for a [Mailosaur account](https://mailosaur.com/)
2. Create a server (mailbox) in your Mailosaur dashboard
3. Get your API key from the account settings
4. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
MAILOSAUR_API_KEY=your-mailosaur-api-key-here
MAILOSAUR_SERVER_ID=your-mailosaur-server-id-here
```

### 4. Configure Your Backend

For the authentication tests to work, you need to configure your backend to send OTP emails to Mailosaur addresses. Update your backend configuration to use your Mailosaur server domain:

```
MAILOSAUR_DOMAIN={MAILOSAUR_SERVER_ID}.mailosaur.net
```

## Running Tests

### Run All E2E Tests

```bash
pnpm run test:e2e
```

### Run Tests in UI Mode

```bash
pnpm run test:e2e:ui
```

### Run Tests in Debug Mode

```bash
pnpm run test:e2e:debug
```

### Run Tests in Headed Mode

```bash
pnpm run test:e2e:headed
```

## Test Structure

### Authentication Tests (`auth-login.spec.ts`)

Tests the passwordless login flow:

- **Full Login Flow**: Tests complete email OTP authentication
- **Invalid OTP**: Tests error handling for wrong OTP codes
- **OTP Resend**: Tests the resend functionality
- **Email Validation**: Tests email format validation

### Homepage Tests (`homepage.spec.ts`)

Basic smoke tests for the homepage:

- Page loading verification
- Page title validation

## How Mailosaur Integration Works

1. **Email Generation**: Tests generate unique email addresses using `mailosaur.servers.generateEmailAddress()`
2. **Email Sending**: Your backend sends OTP emails to these addresses
3. **Email Retrieval**: Tests use `mailosaur.messages.get()` to retrieve emails
4. **OTP Extraction**: Custom `extractOTPCode()` function parses the OTP from email content
5. **Authentication**: Tests complete the login flow using the extracted OTP

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MAILOSAUR_API_KEY` | Your Mailosaur API key | Yes |
| `MAILOSAUR_SERVER_ID` | Your Mailosaur server ID | Yes |

## Test Configuration

Tests are configured in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Web Server**: Automatically starts the Next.js dev server
- **Browsers**: Chromium, Firefox, WebKit
- **Parallel Execution**: Tests run in parallel for faster execution

## Troubleshooting

### Common Issues

1. **"Executable doesn't exist"**: Run `pnpm exec playwright install` to install browsers
2. **"API key not found"**: Ensure `.env` file exists with correct Mailosaur credentials
3. **"Email not received"**: Check that your backend is configured to send emails to Mailosaur
4. **"OTP not found in email"**: Update the `extractOTPCode()` function to match your email format

### Debug Mode

Use `pnpm run test:e2e:debug` to run tests in debug mode, which allows you to:
- Step through test execution
- Inspect page state
- Check network requests
- View console output

### Viewing Test Results

- HTML reports are generated in `playwright-report/`
- Screenshots and videos are saved in `test-results/` (when tests fail)

## Best Practices

1. **Unique Emails**: Always generate unique email addresses for each test to avoid conflicts
2. **Timeouts**: Mailosaur has built-in timeouts for email retrieval (default 10 seconds)
3. **Cleanup**: Consider cleaning up test emails after tests complete
4. **Parallel Execution**: Tests are designed to run in parallel, but email-based tests may need special handling
5. **Environment Isolation**: Use separate Mailosaur servers for different environments (dev/staging/prod)

## CI/CD Integration

For CI/CD pipelines, ensure:

1. Mailosaur credentials are set as environment variables
2. Playwright browsers are installed in your CI environment
3. The Next.js dev server can start properly in CI
4. Consider using `reuseExistingServer: false` in CI to ensure clean state
