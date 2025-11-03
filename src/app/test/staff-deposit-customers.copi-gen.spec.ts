import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, waitForPageReady } from "./test-utils";

// Mock staff user
const mockStaffUser = {
  uid: "3",
  email: "staff@test.local",
  name: "Test Staff",
  role: "staff",
  avatar: null,
};

const mockUsers = [
  {
    Id: 1,
    Email: "driver1@example.com",
    FullName: "Driver One",
    Role: "Driver",
    WalletBalance: 100000,
    CreatedAt: "2024-01-01T00:00:00Z",
  },
  {
    Id: 2,
    Email: "driver2@example.com",
    FullName: "Driver Two",
    Role: "Driver",
    WalletBalance: 50000,
    CreatedAt: "2024-01-02T00:00:00Z",
  },
];

test.describe("Staff Deposit Customers Page", () => {
  test("should render deposit customers page", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/users") && url.searchParams.get("Role") === "Driver") {
        return new Response(JSON.stringify({ Items: mockUsers }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockStaffUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockStaffUser);
    await page.goto("/dashboard/staff/deposit-customers");
    await waitForPageReady(page);

    // Verify page title
    await expect(
      page.getByRole("heading", { name: /Nạp tiền cho khách hàng/i })
    ).toBeVisible();

    // Verify description
    await expect(
      page.getByText(/Tìm kiếm và chọn một khách hàng \(Driver\) để nạp tiền thủ công/i)
    ).toBeVisible();

    console.log("Deposit customers page loaded successfully");
  });

  test("should handle empty users list", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/users") && url.searchParams.get("Role") === "Driver") {
        return new Response(JSON.stringify({ Items: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockStaffUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockStaffUser);
    await page.goto("/dashboard/staff/deposit-customers");
    await waitForPageReady(page);

    // Page should still render with header
    await expect(
      page.getByRole("heading", { name: /Nạp tiền cho khách hàng/i })
    ).toBeVisible();

    console.log("Empty users list handled gracefully");
  });

  test("should handle API error gracefully", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/users")) {
        return new Response(JSON.stringify({ error: "Server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockStaffUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockStaffUser);
    await page.goto("/dashboard/staff/deposit-customers");
    await waitForPageReady(page);

    // Page should still render header even with API error
    await expect(
      page.getByRole("heading", { name: /Nạp tiền cho khách hàng/i })
    ).toBeVisible();

    console.log("API error handled gracefully");
  });
});
