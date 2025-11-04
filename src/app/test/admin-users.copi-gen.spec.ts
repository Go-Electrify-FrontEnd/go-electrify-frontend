import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, mockAdminUser, waitForPageReady } from "./test-utils";

// Mock data for users - matches UserApiSchema
const mockUsers = [
  {
    Id: 1,
    Email: "user1@example.com",
    FullName: "User One",
    Role: "driver",
    WalletBalance: 100000,
    CreateAt: "2024-01-01T00:00:00Z",
  },
  {
    Id: 2,
    Email: "user2@example.com",
    FullName: "User Two",
    Role: "driver",
    WalletBalance: 50000,
    CreateAt: "2024-01-02T00:00:00Z",
  },
  {
    Id: 3,
    Email: "admin@example.com",
    FullName: "Admin User",
    Role: "admin",
    WalletBalance: 0,
    CreateAt: "2024-01-03T00:00:00Z",
  },
];

test.describe("Admin Users Page", () => {
  test("should render users management page with table", async ({
    page,
    next,
  }) => {
    // Mock API calls
    next.onFetch((request) => {
      const url = new URL(request.url);

      // Mock users endpoint
      if (url.pathname.includes("/users")) {
        return new Response(
          JSON.stringify({
            Items: mockUsers,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
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

    // Navigate to users page
    await page.goto("/dashboard/admin/users");

    // Wait for page to load
    await waitForPageReady(page);

    // Verify page title is visible
    await expect(
      page.getByRole("heading", { name: /Quản lý Người Dùng/i })
    ).toBeVisible();

    // Verify subtitle is visible
    await expect(
      page.getByText(/Danh sách người dùng và trạng thái/i)
    ).toBeVisible();

    // Wait for table to be visible
    await page.waitForSelector("table", { timeout: 10000 });

    // Verify table is rendered
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // Verify at least one user is displayed in the table
    const tableRows = page.locator("tbody tr");
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);

    console.log(`Users page loaded successfully with ${rowCount} users`);
  });

  test("should display user data in table", async ({ page, next }) => {
    // Mock API calls
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/users")) {
        return new Response(
          JSON.stringify({
            Items: mockUsers,
          }),
          {
            status: 200,
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
    await page.goto("/dashboard/admin/users");
    await waitForPageReady(page);

    // Wait for table to be populated
    await page.waitForSelector("table tbody tr", { timeout: 10000 });

    // Verify specific user data is displayed
    const firstUser = mockUsers[0];
    await expect(page.getByText(firstUser.Email)).toBeVisible();

    console.log("User data displayed correctly in table");
  });

  test("should handle empty user list gracefully", async ({ page, next }) => {
    // Mock API with empty users list
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/users")) {
        return new Response(
          JSON.stringify({
            Items: [],
          }),
          {
            status: 200,
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
    await page.goto("/dashboard/admin/users");
    await waitForPageReady(page);

    // Page should still render with header
    await expect(
      page.getByRole("heading", { name: /Quản lý Người Dùng/i })
    ).toBeVisible();

    console.log("Empty user list handled gracefully");
  });

  test("should handle API error gracefully", async ({ page, next }) => {
    // Mock API with error response
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/users")) {
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
    await page.goto("/dashboard/admin/users");
    await waitForPageReady(page);

    // Page should still render header even with API error
    await expect(
      page.getByRole("heading", { name: /Quản lý Người Dùng/i })
    ).toBeVisible();

    console.log("API error handled gracefully");
  });
});
