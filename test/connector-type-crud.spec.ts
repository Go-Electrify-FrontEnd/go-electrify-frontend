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

// Admin login helper function
async function loginAsAdmin(page: any) {
  await page.goto("/login");
  await expect(page).toHaveURL("/login");

  const testEmail = process.env.TEST_ADMIN_MAIL!;

  // Verify login form is visible
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();

  // Enter email and submit
  console.log("Admin login - filling email input:", testEmail);
  await page.locator('[data-testid="email-input"]').fill(testEmail);
  await page.locator('[data-testid="login-submit-button"]').click();

  // Wait for OTP form
  await expect(page.locator('[data-testid="login-form"]')).not.toBeVisible();
  await page.waitForSelector('[data-testid="otp-form"]', { timeout: 15000 });
  await expect(page.locator('[data-testid="otp-form"]')).toBeVisible();

  console.log("Waiting for admin email...");

  // Wait for email to arrive
  await page.waitForTimeout(15000);

  const email = await mailosaur.messages.get(serverId, {
    sentTo: testEmail,
  });

  // Extract OTP code from email content
  const otpCode = extractOTPCode(email);
  console.log(`Admin OTP received: ${otpCode}`);

  // Enter the OTP code
  const otpInput = page.locator('[data-testid="otp-input"]');
  await otpInput.focus();
  await page.keyboard.type(otpCode, { delay: 200 });

  // Submit OTP
  await page.locator('[data-testid="otp-submit-button"]').click();

  // Wait for successful login and redirect to dashboard
  await page.waitForURL("/dashboard", { timeout: 10000 });
  await expect(page).toHaveURL("/dashboard");

  console.log("Admin login completed successfully!");
}

test.describe("Connector Types CRUD", () => {
  test("should create connector type with valid data", async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to connector types page
    await page.goto("/dashboard/admin/connector-type");
    await expect(page).toHaveURL("/dashboard/admin/connector-type");

    // Verify page loaded
    await expect(
      page.getByRole("heading", { name: "Quản lý Cổng Kết Nối" }),
    ).toBeVisible();

    // Click create button
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    // Wait for dialog to open
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Tạo Loại Cổng Sạc" }),
    ).toBeVisible();

    // Fill form with valid data
    const testName = `Test Connector ${Date.now()}`;
    await page.getByLabel("Tên").fill(testName);
    await page
      .getByLabel("Mô tả")
      .fill("Test connector description for automated testing");
    await page.getByLabel("Công suất tối đa (kW) *").fill("150");

    // Submit form
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    // Wait for success message
    await expect(
      page.getByText("Hành động được thực hiện thành công"),
    ).toBeVisible();

    // Verify dialog closed
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // Verify new connector type appears in table
    await expect(page.getByText(testName)).toBeVisible();
    await expect(page.getByText("150 kW")).toBeVisible();

    console.log("Connector type created successfully!");
  });

  test("should validate required fields on create", async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to connector types page
    await page.goto("/dashboard/admin/connector-type");

    // Click create button
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    // Try to submit without filling required fields
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    // Should show validation error for name
    await expect(page.getByText("Tên cổng kết nối là bắt buộc")).toBeVisible();

    // Fill name but leave power empty
    await page.getByLabel("Tên").fill("Test Connector");
    await page.getByLabel("Công suất tối đa (kW) *").fill("");

    // Try to submit
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    // Should show validation error for power
    await expect(page.getByText("Công suất phải là số")).toBeVisible();

    console.log("Field validation working correctly!");
  });

  test("should validate power field constraints", async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to connector types page
    await page.goto("/dashboard/admin/connector-type");

    // Click create button
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    // Test negative power
    await page.getByLabel("Tên").fill("Test Connector");
    await page.getByLabel("Công suất tối đa (kW) *").fill("-50");
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    await expect(page.getByText("Công suất phải lớn hơn 0")).toBeVisible();

    // Test power too high
    await page.getByLabel("Công suất tối đa (kW) *").fill("2000");
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    await expect(
      page.getByText("Công suất vượt quá giới hạn cho phép"),
    ).toBeVisible();

    console.log("Power field validation working correctly!");
  });

  test("should validate description length", async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to connector types page
    await page.goto("/dashboard/admin/connector-type");

    // Click create button
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    // Fill required fields
    await page.getByLabel("Tên").fill("Test Connector");
    await page.getByLabel("Công suất tối đa (kW) *").fill("100");

    // Try description too long (over 200 characters)
    const longDescription = "a".repeat(201);
    await page.getByLabel("Mô tả").fill(longDescription);

    // Submit
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    // Should show validation error
    await expect(page.getByText("Mô tả tối đa 200 ký tự")).toBeVisible();

    console.log("Description length validation working correctly!");
  });

  test("should update connector type", async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to connector types page
    await page.goto("/dashboard/admin/connector-type");

    // Find an existing connector type and click edit
    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toBeVisible();

    // Click the actions menu
    await firstRow.locator('[aria-label="Mở menu"]').click();

    // Click edit
    await page.getByRole("menuitem", { name: "Chỉnh sửa" }).click();

    // Wait for edit dialog
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Chỉnh sửa Loại Cổng Sạc" }),
    ).toBeVisible();

    // Update the name
    const updatedName = `Updated Connector ${Date.now()}`;
    await page.getByLabel("Tên").fill(updatedName);

    // Update power
    await page.getByLabel("Công suất tối đa (kW) *").fill("200");

    // Submit
    await page.getByRole("button", { name: "Cập nhật Loại Cổng" }).click();

    // Wait for success message
    await expect(
      page.getByText("Hành động được thực hiện thành công"),
    ).toBeVisible();

    // Verify dialog closed
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // Verify updated data appears in table
    await expect(page.getByText(updatedName)).toBeVisible();
    await expect(page.getByText("200 kW")).toBeVisible();

    console.log("Connector type updated successfully!");
  });

  test("should delete connector type with confirmation", async ({ page }) => {
    await loginAsAdmin(page);

    // First create a test connector type to delete
    await page.goto("/dashboard/admin/connector-type");
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    const deleteTestName = `Delete Test ${Date.now()}`;
    await page.getByLabel("Tên").fill(deleteTestName);
    await page.getByLabel("Công suất tối đa (kW) *").fill("50");
    await page.getByRole("button", { name: "Tạo Loại Cổng" }).click();

    await expect(
      page.getByText("Hành động được thực hiện thành công"),
    ).toBeVisible();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // Now delete it
    const testRow = page
      .locator("tbody tr")
      .filter({ hasText: deleteTestName });
    await expect(testRow).toBeVisible();

    // Click actions menu
    await testRow.locator('[aria-label="Mở menu"]').click();

    // Click delete
    await page.getByRole("menuitem", { name: "Xóa" }).click();

    // Wait for delete confirmation dialog
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Xác nhận xóa")).toBeVisible();

    // Enter confirmation text
    await page
      .getByLabel("Nhập tên cổng kết nối để xác nhận")
      .fill(deleteTestName);

    // Click delete button
    await page.getByRole("button", { name: "Xóa Loại Cổng" }).click();

    // Wait for success message
    await expect(
      page.getByText("Hành động được thực hiện thành công"),
    ).toBeVisible();

    // Verify dialog closed
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // Verify connector type is removed from table
    await expect(page.getByText(deleteTestName)).not.toBeVisible();

    console.log("Connector type deleted successfully!");
  });

  test("should validate delete confirmation", async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to connector types page
    await page.goto("/dashboard/admin/connector-type");

    // Find a connector type and click delete
    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toBeVisible();

    // Click actions menu
    await firstRow.locator('[aria-label="Mở menu"]').click();

    // Click delete
    await page.getByRole("menuitem", { name: "Xóa" }).click();

    // Wait for delete confirmation dialog
    await expect(page.getByRole("dialog")).toBeVisible();

    // Try to delete without entering confirmation text
    await page.getByRole("button", { name: "Xóa Loại Cổng" }).click();

    // Should show validation error
    await expect(
      page.getByText("Vui lòng nhập tên cổng kết nối để xác nhận"),
    ).toBeVisible();

    // Enter wrong confirmation text
    await page
      .getByLabel("Nhập tên cổng kết nối để xác nhận")
      .fill("wrong name");
    await page.getByRole("button", { name: "Xóa Loại Cổng" }).click();

    // Should still show error (confirmation text must match)
    await expect(
      page.getByText("Vui lòng nhập tên cổng kết nối để xác nhận"),
    ).toBeVisible();

    console.log("Delete confirmation validation working correctly!");
  });

  test("should search and filter connector types", async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to connector types page
    await page.goto("/dashboard/admin/connector-type");

    // Verify search input exists
    const searchInput = page.getByPlaceholder("Tìm kiếm cổng kết nối...");
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill("Type 2");

    // Should filter results
    await page.waitForTimeout(500); // Wait for search to apply

    // Verify only matching results are shown
    const visibleRows = page.locator("tbody tr");
    const rowCount = await visibleRows.count();

    if (rowCount > 0) {
      // If there are results, they should contain the search term
      for (let i = 0; i < rowCount; i++) {
        const rowText = await visibleRows.nth(i).textContent();
        expect(rowText?.toLowerCase()).toContain("type 2");
      }
    }

    console.log("Search functionality working correctly!");
  });
});

/**
 * Extract OTP code from Mailosaur email message
 */
function extractOTPCode(email: any): string {
  console.log("Extracting OTP from email with subject:", email.subject);

  // Try to extract from HTML content first
  if (email.html && email.html.body) {
    const htmlMatches = email.html.body.match(/\b\d{6}\b/g);
    if (htmlMatches && htmlMatches.length > 0) {
      return htmlMatches[0];
    }
  }

  // Try to extract from text content
  if (email.text && email.text.body) {
    const textMatches = email.text.body.match(/\b\d{6}\b/g);
    if (textMatches && textMatches.length > 0) {
      return textMatches[0];
    }
  }

  // If no 6-digit code found, look for any sequence of digits
  const allDigits =
    email.html?.body?.match(/\d+/g) || email.text?.body?.match(/\d+/g) || [];
  const sixDigitCodes = allDigits.filter((code: string) => code.length === 6);

  if (sixDigitCodes.length > 0) {
    return sixDigitCodes[0];
  }

  throw new Error(
    `Could not extract OTP code from email. Subject: "${email.subject}"`,
  );
}
