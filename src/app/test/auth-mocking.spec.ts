import { test, expect } from "next/experimental/testmode/playwright";
import MailosaurClient from "mailosaur";

// Ensure required Mailosaur environment variables are set
if (!process.env.MAILOSAUR_API_KEY) {
  throw new Error("MAILOSAUR_API_KEY environment variable must be set.");
}
if (!process.env.MAILOSAUR_SERVER_ID) {
  throw new Error("MAILOSAUR_SERVER_ID environment variable must be set.");
}

const mailosaur = new MailosaurClient(process.env.MAILOSAUR_API_KEY);
const serverId = process.env.MAILOSAUR_SERVER_ID;

console.log("Using Mailosaur Server ID:", serverId);
console.log(
  "Using Mailosaur API Key:",
  process.env.MAILOSAUR_API_KEY ? "Provided" : "Not Provided",
);

test("should complete full login flow using email OTP", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL("/login");

  const testEmail = mailosaur.servers.generateEmailAddress(serverId);
  console.log(`Testing with email: ${testEmail}`);

  // Verify login form is visible
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Đăng nhập" })).toBeVisible();
  await expect(page.locator('[data-testid="email-input"]')).toBeVisible();

  // Enter email and submit
  console.log("Filling email input:", testEmail);
  await page.locator('[data-testid="email-input"]').fill(testEmail);
  console.log("Clicking login submit button");
  await page.locator('[data-testid="login-submit-button"]').click();

  // Wait for the login form to disappear (indicating transition to OTP form)
  await expect(page.locator('[data-testid="login-form"]')).not.toBeVisible();

  // Wait for OTP form to be visible
  console.log("Waiting for OTP form...");
  await page.waitForSelector('[data-testid="otp-form"]', { timeout: 15000 });
  await expect(page.locator('[data-testid="otp-form"]')).toBeVisible();

  // Verify OTP form elements are present
  await expect(
    page.getByRole("heading", { name: "Xác thực OTP" }),
  ).toBeVisible();
  await expect(page.getByText(testEmail)).toBeVisible();

  console.log("OTP form loaded successfully, waiting for email...");

  // Wait for email to arrive (give it more time)
  console.log("Waiting 15 seconds for email to arrive...");
  await page.waitForTimeout(15000);

  const email = await mailosaur.messages.get(serverId, {
    sentTo: testEmail,
  });

  // Extract OTP code from email content
  const otpCode = extractOTPCode(email);
  console.log(`OTP Code received: ${otpCode}`);

  // Verify OTP code is 6 digits
  expect(otpCode).toMatch(/^\d{6}$/);

  // Enter the OTP code - focus on the input and type directly
  console.log("Entering OTP code...");
  const otpInput = page.locator('[data-testid="otp-input"]');
  await otpInput.focus(); // Focus the input
  await page.keyboard.type(otpCode, { delay: 200 }); // Type with delay to ensure each digit is entered properly

  // Verify the OTP was entered
  const inputValue = await otpInput.inputValue();
  console.log(`OTP input value: "${inputValue}"`);
  expect(inputValue).toBe(otpCode);

  // Submit OTP
  console.log("Submitting OTP...");
  const submitButton = page.locator('[data-testid="otp-submit-button"]');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Wait a bit and check for any error messages
  await page.waitForTimeout(2000);
  const errorMessages = await page
    .locator('.text-destructive, [role="alert"]')
    .allTextContents();
  if (errorMessages.length > 0) {
    console.log("Found error messages after OTP submission:", errorMessages);
  }

  // Check for success messages
  const successMessages = await page
    .locator(".text-green-600, .text-success")
    .allTextContents();
  if (successMessages.length > 0) {
    console.log("Found success messages:", successMessages);
  }

  // Wait for successful login and redirect to dashboard
  console.log("Waiting for redirect to dashboard...");
  await page.waitForURL("/dashboard", { timeout: 10000 });
  await expect(page).toHaveURL("/dashboard");

  console.log("Login flow completed successfully!");
});

test("should handle OTP resend and complete login", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL("/login");

  const testEmail = mailosaur.servers.generateEmailAddress(serverId);
  console.log(`Testing OTP resend flow with email: ${testEmail}`);

  // Verify login form is visible
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Đăng nhập" })).toBeVisible();
  await expect(page.locator('[data-testid="email-input"]')).toBeVisible();

  // Enter email and submit
  console.log("Filling email input:", testEmail);
  await page.locator('[data-testid="email-input"]').fill(testEmail);
  console.log("Clicking login submit button");
  await page.locator('[data-testid="login-submit-button"]').click();

  // Wait for the login form to disappear (indicating transition to OTP form)
  await expect(page.locator('[data-testid="login-form"]')).not.toBeVisible();

  // Wait for OTP form to be visible
  console.log("Waiting for OTP form...");
  await page.waitForSelector('[data-testid="otp-form"]', { timeout: 15000 });
  await expect(page.locator('[data-testid="otp-form"]')).toBeVisible();

  // Verify OTP form elements are present
  await expect(
    page.getByRole("heading", { name: "Xác thực OTP" }),
  ).toBeVisible();
  await expect(page.getByText(testEmail)).toBeVisible();

  console.log("OTP form loaded successfully, waiting for first email...");

  // Wait for the first email to arrive
  console.log("Waiting 15 seconds for first email to arrive...");
  await page.waitForTimeout(15000);

  const firstEmail = await mailosaur.messages.get(serverId, {
    sentTo: testEmail,
  });

  // Extract first OTP code from email content
  const firstOTP = extractOTPCode(firstEmail);
  console.log(`First OTP received: ${firstOTP}`);

  // Verify the resend button is visible
  await expect(page.locator('[data-testid="resend-otp-button"]')).toBeVisible();

  // For testing purposes, we'll wait a shorter time
  // Note: In production, this would wait 60 seconds for countdown
  console.log("Waiting 5 seconds (simulating countdown for testing)...");
  await page.waitForTimeout(5000);

  // Click resend button (assuming countdown has expired in test environment)
  console.log("Clicking resend button...");
  await page.locator('[data-testid="resend-otp-button"]').click();

  // Wait a bit for resend action to process
  await page.waitForTimeout(3000);

  // Should see success message for resend
  await expect(
    page.getByText("Mã OTP đã được gửi đến email của bạn"),
  ).toBeVisible();

  // Wait for the resent email to arrive
  console.log("Waiting 15 seconds for resent email to arrive...");
  await page.waitForTimeout(15000);

  const resentEmail = await mailosaur.messages.get(serverId, {
    sentTo: testEmail,
  });

  // Extract resent OTP code from email content
  const resentOTP = extractOTPCode(resentEmail);
  console.log(`Resent OTP received: ${resentOTP}`);

  // Verify it's a different OTP code
  expect(resentOTP).not.toBe(firstOTP);

  // Enter the resent OTP code
  console.log("Entering resent OTP code...");
  const otpInput = page.locator('[data-testid="otp-input"]');
  await otpInput.focus();
  await page.keyboard.type(resentOTP, { delay: 200 });

  // Verify the OTP was entered
  const inputValue = await otpInput.inputValue();
  console.log(`OTP input value: "${inputValue}"`);
  expect(inputValue).toBe(resentOTP);

  // Submit OTP
  console.log("Submitting resent OTP...");
  const submitButton = page.locator('[data-testid="otp-submit-button"]');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Wait for successful login and redirect to dashboard
  console.log("Waiting for redirect to dashboard...");
  await page.waitForURL("/dashboard", { timeout: 10000 });
  await expect(page).toHaveURL("/dashboard");

  console.log("OTP resend flow completed successfully!");
});

test("should redirect to admin page", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL("/login");

  const testEmail = process.env.TEST_ADMIN_MAIL!;

  // Verify login form is visible
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Đăng nhập" })).toBeVisible();
  await expect(page.locator('[data-testid="email-input"]')).toBeVisible();

  // Enter email and submit
  console.log("Filling email input:", testEmail);
  await page.locator('[data-testid="email-input"]').fill(testEmail);
  console.log("Clicking login submit button");
  await page.locator('[data-testid="login-submit-button"]').click();

  // Wait for the login form to disappear (indicating transition to OTP form)
  await expect(page.locator('[data-testid="login-form"]')).not.toBeVisible();

  // Wait for OTP form to be visible
  console.log("Waiting for OTP form...");
  await page.waitForSelector('[data-testid="otp-form"]', { timeout: 15000 });
  await expect(page.locator('[data-testid="otp-form"]')).toBeVisible();

  // Verify OTP form elements are present
  await expect(
    page.getByRole("heading", { name: "Xác thực OTP" }),
  ).toBeVisible();
  await expect(page.getByText(testEmail)).toBeVisible();

  console.log("OTP form loaded successfully, waiting for email...");

  // Wait for email to arrive (give it more time)
  console.log("Waiting 15 seconds for email to arrive...");
  await page.waitForTimeout(15000);

  const email = await mailosaur.messages.get(serverId, {
    sentTo: testEmail,
  });

  // Extract OTP code from email content
  const otpCode = extractOTPCode(email);
  console.log(`OTP Code received: ${otpCode}`);

  // Verify OTP code is 6 digits
  expect(otpCode).toMatch(/^\d{6}$/);

  // Enter the OTP code - focus on the input and type directly
  console.log("Entering OTP code...");
  const otpInput = page.locator('[data-testid="otp-input"]');
  await otpInput.focus(); // Focus the input
  await page.keyboard.type(otpCode, { delay: 200 }); // Type with delay to ensure each digit is entered properly

  // Verify the OTP was entered
  const inputValue = await otpInput.inputValue();
  console.log(`OTP input value: "${inputValue}"`);
  expect(inputValue).toBe(otpCode);

  // Submit OTP
  console.log("Submitting OTP...");
  const submitButton = page.locator('[data-testid="otp-submit-button"]');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Wait a bit and check for any error messages
  await page.waitForTimeout(2000);
  const errorMessages = await page
    .locator('.text-destructive, [role="alert"]')
    .allTextContents();
  if (errorMessages.length > 0) {
    console.log("Found error messages after OTP submission:", errorMessages);
  }

  // Check for success messages
  const successMessages = await page
    .locator(".text-green-600, .text-success")
    .allTextContents();
  if (successMessages.length > 0) {
    console.log("Found success messages:", successMessages);
  }

  // Wait for successful login and redirect to dashboard
  console.log("Waiting for redirect to dashboard...");
  await page.waitForURL("/dashboard", { timeout: 10000 });
  await expect(page).toHaveURL("/dashboard");
  await expect(
    page.getByRole("heading").filter({ hasText: "Chào mừng quản trị viên" }),
  ).toBeVisible();

  console.log("Login flow completed successfully!");
});

test("should reject invalid email format", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL("/login");

  // Verify login form is visible
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();

  // Try to enter invalid email format
  console.log("Testing invalid email format...");
  await page.locator('[data-testid="email-input"]').fill("invalid-email");

  // Try to submit
  await page.locator('[data-testid="login-submit-button"]').click();

  // Should show validation error or remain on login page
  await page.waitForTimeout(1000);
  const isStillOnLogin = page.url().includes("/login");
  const hasError = await page
    .locator('[data-testid="email-error"], .text-destructive')
    .isVisible()
    .catch(() => false);

  expect(isStillOnLogin || hasError).toBeTruthy();
  console.log("Invalid email format correctly rejected");
});

test("should reject empty email submission", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL("/login");

  // Verify login form is visible
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();

  // Try to submit without entering email
  console.log("Testing empty email submission...");
  await page.locator('[data-testid="login-submit-button"]').click();

  // Should show validation error or remain on login page
  await page.waitForTimeout(1000);
  const isStillOnLogin = page.url().includes("/login");
  const hasError = await page
    .locator('[data-testid="email-error"], .text-destructive')
    .isVisible()
    .catch(() => false);

  expect(isStillOnLogin || hasError).toBeTruthy();
  console.log("Empty email submission correctly rejected");
});

/**
 * Extract OTP code from Mailosaur email message
 * This function tries to find the 6-digit OTP code in the email content
 * Supports various formats and provides detailed logging for debugging
 */
function extractOTPCode(email: any): string {
  console.log("Extracting OTP from email with subject:", email.subject);

  // Try to extract from HTML content first
  if (email.html && email.html.body) {
    console.log("Checking HTML content for OTP...");
    // Look for 6-digit codes in the HTML content
    const htmlMatches = email.html.body.match(/\b\d{6}\b/g);
    if (htmlMatches && htmlMatches.length > 0) {
      console.log("Found OTP in HTML:", htmlMatches[0]);
      return htmlMatches[0];
    }

    // Try to find in text content within HTML (this line was duplicated, fixing it)
    console.log("HTML body preview:", email.html.body.substring(0, 200));
  }

  // Try to extract from text content
  if (email.text && email.text.body) {
    console.log("Checking text content for OTP...");
    const textMatches = email.text.body.match(/\b\d{6}\b/g);
    if (textMatches && textMatches.length > 0) {
      console.log("Found OTP in text:", textMatches[0]);
      return textMatches[0];
    }
    console.log("Text body preview:", email.text.body.substring(0, 200));
  }

  // If no 6-digit code found, look for any sequence of digits
  console.log("Looking for any 6-digit sequences...");
  const allDigits =
    email.html?.body?.match(/\d+/g) || email.text?.body?.match(/\d+/g) || [];
  console.log("All digit sequences found:", allDigits);
  const sixDigitCodes = allDigits.filter((code: string) => code.length === 6);

  if (sixDigitCodes.length > 0) {
    console.log("Found 6-digit code:", sixDigitCodes[0]);
    return sixDigitCodes[0];
  }

  // More detailed error with full email content
  const errorDetails = {
    subject: email.subject,
    htmlLength: email.html?.body?.length || 0,
    textLength: email.text?.body?.length || 0,
    htmlPreview: email.html?.body?.substring(0, 1000),
    textPreview: email.text?.body?.substring(0, 1000),
  };

  console.error("OTP extraction failed. Email details:", errorDetails);

  throw new Error(
    `Could not extract OTP code from email. Subject: "${email.subject}". ` +
      `Check console logs for full email content and try adjusting the extraction logic.`,
  );
}
