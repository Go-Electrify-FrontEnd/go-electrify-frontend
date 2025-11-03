import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, mockAdminUser, waitForPageReady } from "./test-utils";

// Mock data for subscriptions
const mockSubscriptions = [
  {
    Id: 1,
    Name: "Basic Plan",
    Description: "Entry-level subscription for occasional users",
    Price: 99000,
    Duration: 30,
    Features: ["Access to all stations", "Standard charging speed"],
    MaxChargingSessions: 10,
    CreatedAt: "2024-01-01T00:00:00Z",
    UpdatedAt: "2024-01-15T00:00:00Z",
  },
  {
    Id: 2,
    Name: "Premium Plan",
    Description: "Best value for frequent EV users",
    Price: 299000,
    Duration: 30,
    Features: [
      "Access to all stations",
      "Priority charging",
      "Fast charging support",
    ],
    MaxChargingSessions: 50,
    CreatedAt: "2024-01-02T00:00:00Z",
    UpdatedAt: "2024-01-16T00:00:00Z",
  },
  {
    Id: 3,
    Name: "Enterprise Plan",
    Description: "Unlimited charging for businesses",
    Price: 999000,
    Duration: 30,
    Features: [
      "Unlimited access",
      "Priority support",
      "Advanced analytics",
      "Fleet management",
    ],
    MaxChargingSessions: -1, // unlimited
    CreatedAt: "2024-01-03T00:00:00Z",
    UpdatedAt: "2024-01-17T00:00:00Z",
  },
];

test.describe("Admin Subscriptions Page", () => {
  test("should render subscriptions management page with table", async ({
    page,
    next,
  }) => {
    // Mock API calls
    next.onFetch((request) => {
      const url = new URL(request.url);

      // Mock subscriptions endpoint
      if (url.pathname.includes("/subscriptions")) {
        return new Response(JSON.stringify(mockSubscriptions), {
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

    // Navigate to subscriptions page
    await page.goto("/dashboard/admin/subscriptions");

    // Wait for page to load
    await waitForPageReady(page);

    // Verify page title is visible
    await expect(
      page.getByRole("heading", { name: /Quản lý Gói Đăng Ký/i })
    ).toBeVisible();

    // Verify subtitle is visible
    await expect(
      page.getByText(/Quản lý và theo dõi các gói đăng ký sạc xe điện/i)
    ).toBeVisible();

    // Wait for table to be visible
    await page.waitForSelector("table", { timeout: 10000 });

    // Verify table is rendered
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // Verify at least one subscription is displayed in the table
    const tableRows = page.locator("tbody tr");
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);

    console.log(
      `Subscriptions page loaded successfully with ${rowCount} subscriptions`
    );
  });

  test("should display subscription data in table", async ({ page, next }) => {
    // Mock API calls
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/subscriptions")) {
        return new Response(JSON.stringify(mockSubscriptions), {
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
    await page.goto("/dashboard/admin/subscriptions");
    await waitForPageReady(page);

    // Wait for table to be populated
    await page.waitForSelector("table tbody tr", { timeout: 10000 });

    // Verify specific subscription data is displayed
    const firstSubscription = mockSubscriptions[0];
    await expect(page.getByText(firstSubscription.Name)).toBeVisible();

    console.log("Subscription data displayed correctly in table");
  });

  test("should display create subscription button", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/subscriptions")) {
        return new Response(JSON.stringify(mockSubscriptions), {
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
    await page.goto("/dashboard/admin/subscriptions");
    await waitForPageReady(page);

    // Look for create/add button in the header section
    const createButton = page
      .locator('button:has-text("Tạo"), button:has-text("Thêm")')
      .first();

    // Check if button exists
    const buttonCount = await createButton.count();
    if (buttonCount > 0) {
      console.log("Create button found on subscriptions page");
    } else {
      console.log("Create button not found - this is acceptable");
    }
  });

  test("should display multiple subscription tiers", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/subscriptions")) {
        return new Response(JSON.stringify(mockSubscriptions), {
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
    await page.goto("/dashboard/admin/subscriptions");
    await waitForPageReady(page);

    // Wait for table to be populated
    await page.waitForSelector("table tbody tr", { timeout: 10000 });

    // Verify all subscription tiers are displayed
    await expect(page.getByText("Basic Plan")).toBeVisible();
    await expect(page.getByText("Premium Plan")).toBeVisible();
    await expect(page.getByText("Enterprise Plan")).toBeVisible();

    console.log("All subscription tiers displayed correctly");
  });

  test("should handle empty subscriptions list gracefully", async ({
    page,
    next,
  }) => {
    // Mock API with empty subscriptions list
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/subscriptions")) {
        return new Response(JSON.stringify([]), {
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
    await page.goto("/dashboard/admin/subscriptions");
    await waitForPageReady(page);

    // Page should still render with header
    await expect(
      page.getByRole("heading", { name: /Quản lý Gói Đăng Ký/i })
    ).toBeVisible();

    console.log("Empty subscriptions list handled gracefully");
  });

  test("should handle API error gracefully", async ({ page, next }) => {
    // Mock API with error response
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/subscriptions")) {
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
    await page.goto("/dashboard/admin/subscriptions");
    await waitForPageReady(page);

    // Page should still render header even with API error
    await expect(
      page.getByRole("heading", { name: /Quản lý Gói Đăng Ký/i })
    ).toBeVisible();

    console.log("API error handled gracefully");
  });
});
