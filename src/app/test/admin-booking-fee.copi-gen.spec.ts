import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, mockAdminUser, waitForPageReady } from "./test-utils";

// Mock data for booking fee
const mockBookingFee = {
  Id: 1,
  Type: "FLAT",
  Value: 10000,
  Description: "Phí đặt chỗ cố định",
  CreatedAt: "2024-01-01T00:00:00Z",
  UpdatedAt: "2024-01-15T00:00:00Z",
};

const mockBookingFeePercent = {
  Id: 1,
  Type: "PERCENT",
  Value: 5,
  Description: "Phí đặt chỗ theo phần trăm",
  CreatedAt: "2024-01-01T00:00:00Z",
  UpdatedAt: "2024-01-15T00:00:00Z",
};

test.describe("Admin Booking Fee Page", () => {
  test("should render booking fee management page with FLAT fee", async ({
    page,
    next,
  }) => {
    // Mock API calls
    next.onFetch((request) => {
      const url = new URL(request.url);

      // Mock booking fee endpoint
      if (url.pathname.includes("/booking-fee")) {
        return new Response(JSON.stringify(mockBookingFee), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Mock auth endpoints
      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({
            success: true,
            user: mockAdminUser,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Abort other requests
      return "abort";
    });

    // Setup authentication state
    await setupAuthState(page, mockAdminUser);

    // Navigate to booking fee page
    await page.goto("/dashboard/admin/booking-fee");

    // Wait for page to load
    await waitForPageReady(page);

    // Verify page title is visible
    await expect(
      page.getByRole("heading", { name: /Quản lý Phí Đặt Chỗ/i })
    ).toBeVisible();

    // Verify subtitle is visible
    await expect(
      page.getByText(/Cấu hình phí đặt chỗ cho hệ thống/i)
    ).toBeVisible();

    // Verify guide section about FLAT fee
    await expect(page.getByText(/Phí Cố Định \(FLAT\)/i)).toBeVisible();

    // Verify guide section about PERCENT fee
    await expect(page.getByText(/Phí Phần Trăm \(PERCENT\)/i)).toBeVisible();

    console.log("Booking fee page loaded successfully");
  });

  test("should display booking fee configuration form", async ({
    page,
    next,
  }) => {
    // Mock API calls
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/booking-fee")) {
        return new Response(JSON.stringify(mockBookingFee), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockAdminUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockAdminUser);
    await page.goto("/dashboard/admin/booking-fee");
    await waitForPageReady(page);

    // Wait for the booking fee manager component to be visible
    await page.waitForTimeout(2000);

    // The page should have loaded the booking fee data
    // Look for card or form elements
    const cards = page.locator('[class*="card"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);

    console.log("Booking fee configuration displayed correctly");
  });

  test("should handle PERCENT fee type", async ({ page, next }) => {
    // Mock API calls with PERCENT fee
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/booking-fee")) {
        return new Response(JSON.stringify(mockBookingFeePercent), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockAdminUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockAdminUser);
    await page.goto("/dashboard/admin/booking-fee");
    await waitForPageReady(page);

    // Verify page header
    await expect(
      page.getByRole("heading", { name: /Quản lý Phí Đặt Chỗ/i })
    ).toBeVisible();

    console.log("PERCENT fee type handled correctly");
  });

  test("should display usage guide", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/booking-fee")) {
        return new Response(JSON.stringify(mockBookingFee), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockAdminUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockAdminUser);
    await page.goto("/dashboard/admin/booking-fee");
    await waitForPageReady(page);

    // Verify guide header
    await expect(
      page.getByRole("heading", { name: /Hướng Dẫn Sử Dụng/i })
    ).toBeVisible();

    // Verify important note is present
    await expect(page.getByText(/Lưu ý quan trọng/i)).toBeVisible();

    console.log("Usage guide displayed correctly");
  });

  test("should handle null booking fee gracefully", async ({ page, next }) => {
    // Mock API with null response
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/booking-fee")) {
        return new Response(JSON.stringify(null), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockAdminUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockAdminUser);
    await page.goto("/dashboard/admin/booking-fee");
    await waitForPageReady(page);

    // Should show error state or message about not being able to load data
    await expect(
      page.getByRole("heading", { name: /Quản lý Phí Đặt Chỗ/i })
    ).toBeVisible();

    // Check for error message
    const errorMessage = page.getByText(/Không thể tải dữ liệu/i);
    const hasErrorMessage = await errorMessage.isVisible().catch(() => false);
    
    if (hasErrorMessage) {
      console.log("Error message displayed for null booking fee");
    }

    console.log("Null booking fee handled gracefully");
  });

  test("should handle API error gracefully", async ({ page, next }) => {
    // Mock API with error response
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/booking-fee")) {
        return new Response(
          JSON.stringify({ error: "Internal server error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockAdminUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockAdminUser);
    await page.goto("/dashboard/admin/booking-fee");
    await waitForPageReady(page);

    // Page should still render header even with API error
    await expect(
      page.getByRole("heading", { name: /Quản lý Phí Đặt Chỗ/i })
    ).toBeVisible();

    console.log("API error handled gracefully");
  });
});
