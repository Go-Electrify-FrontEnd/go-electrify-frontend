import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, mockDriverUser, waitForPageReady } from "./test-utils";

const mockSubscriptions = [
  {
    Id: 1,
    Name: "Basic Plan",
    Description: "Entry-level subscription",
    Price: 99000,
    Duration: 30,
  },
  {
    Id: 2,
    Name: "Premium Plan",
    Description: "Best value for frequent users",
    Price: 299000,
    Duration: 30,
  },
];

const mockUserSubscriptions = [
  {
    Id: 1,
    SubscriptionId: 1,
    SubscriptionName: "Basic Plan",
    UserId: 2,
    Status: "ACTIVE",
    TotalKwh: 100,
    RemainingKwh: 75,
    Price: 99000,
    StartDate: "2024-02-01T00:00:00Z",
    EndDate: "2024-03-01T00:00:00Z",
  },
];

test.describe("Driver Plans & Billing Page", () => {
  test("should render plans and billing page", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/subscriptions") && !url.pathname.includes("/wallet")) {
        return new Response(JSON.stringify(mockSubscriptions), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/wallet/subscriptions")) {
        return new Response(JSON.stringify(mockUserSubscriptions), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockDriverUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockDriverUser);
    await page.goto("/dashboard/plans-billing");
    await waitForPageReady(page);

    // Verify page title
    await expect(
      page.getByRole("heading", { name: /Gói Đăng Ký & Thanh Toán/i })
    ).toBeVisible();

    // Verify stats cards
    await expect(page.getByText(/Gói Đang Hoạt Động/i)).toBeVisible();
    await expect(page.getByText(/Điện Năng Còn Lại/i)).toBeVisible();
    await expect(page.getByText(/Tỷ Lệ Sử Dụng/i)).toBeVisible();

    console.log("Plans & Billing page loaded successfully");
  });

  test("should display user subscriptions", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/subscriptions") && !url.pathname.includes("/wallet")) {
        return new Response(JSON.stringify(mockSubscriptions), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/wallet/subscriptions")) {
        return new Response(JSON.stringify(mockUserSubscriptions), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockDriverUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockDriverUser);
    await page.goto("/dashboard/plans-billing");
    await waitForPageReady(page);

    // Verify user subscription card
    await expect(page.getByText(/Gói Đăng Ký Của Bạn/i)).toBeVisible();
    await expect(page.getByText("Basic Plan")).toBeVisible();

    console.log("User subscriptions displayed correctly");
  });

  test("should display available subscription plans", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/subscriptions") && !url.pathname.includes("/wallet")) {
        return new Response(JSON.stringify(mockSubscriptions), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/wallet/subscriptions")) {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockDriverUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockDriverUser);
    await page.goto("/dashboard/plans-billing");
    await waitForPageReady(page);

    // Verify available plans section
    await expect(page.getByText(/Các Gói Đăng Ký Có Sẵn/i)).toBeVisible();

    console.log("Available subscription plans displayed correctly");
  });

  test("should show empty state when no user subscriptions", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/subscriptions") && !url.pathname.includes("/wallet")) {
        return new Response(JSON.stringify(mockSubscriptions), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/wallet/subscriptions")) {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockDriverUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockDriverUser);
    await page.goto("/dashboard/plans-billing");
    await waitForPageReady(page);

    // Should show empty state
    await expect(page.getByText(/Chưa có gói đăng ký/i)).toBeVisible();

    console.log("Empty subscription state displayed correctly");
  });
});
