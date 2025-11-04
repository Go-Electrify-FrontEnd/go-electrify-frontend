import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, mockDriverUser, waitForPageReady } from "./test-utils";

test.describe("Driver Settings Page", () => {
  test("should render settings page with profile section", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockDriverUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockDriverUser);
    await page.goto("/dashboard/settings");
    await waitForPageReady(page);

    // Verify profile section header (using text selector as h3 may not have heading role)
    await expect(
      page.getByText("Hồ sơ cá nhân")
    ).toBeVisible();

    // Verify description
    await expect(
      page.getByText(/Cập nhật ảnh đại diện và thông tin hiển thị của bạn/i)
    ).toBeVisible();

    console.log("Settings page loaded successfully");
  });

  test("should display profile update sections", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockDriverUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockDriverUser);
    await page.goto("/dashboard/settings");
    await waitForPageReady(page);

    // Page should have profile update components
    await expect(
      page.getByText("Hồ sơ cá nhân")
    ).toBeVisible();

    console.log("Profile update sections displayed correctly");
  });
});
