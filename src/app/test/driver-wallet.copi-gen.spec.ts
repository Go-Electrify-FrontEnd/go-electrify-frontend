import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, mockDriverUser, waitForPageReady } from "./test-utils";

const mockWallet = {
  Id: 1,
  UserId: 2,
  Balance: 500000,
  Currency: "VND",
  UpdatedAt: "2024-02-15T10:00:00Z",
};

const mockTransactions = [
  {
    Id: 1,
    Type: "DEPOSIT",
    Amount: 100000,
    Description: "Nạp tiền vào ví",
    Status: "COMPLETED",
    CreatedAt: "2024-02-15T10:00:00Z",
  },
  {
    Id: 2,
    Type: "PAYMENT",
    Amount: -50000,
    Description: "Thanh toán phí sạc",
    Status: "COMPLETED",
    CreatedAt: "2024-02-14T15:30:00Z",
  },
];

test.describe("Driver Wallet Page", () => {
  test("should render wallet page with balance and transactions", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/wallet/me/balance")) {
        return new Response(JSON.stringify(mockWallet), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/wallet/me/transactions")) {
        return new Response(
          JSON.stringify({
            Data: mockTransactions,
            Total: mockTransactions.length,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
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
    await page.goto("/dashboard/wallet");
    await waitForPageReady(page);

    // Verify page title
    await expect(
      page.getByRole("heading", { name: /Ví của tôi/i })
    ).toBeVisible();

    // Verify subtitle
    await expect(
      page.getByText(/Quản lý số dư và giao dịch của bạn/i)
    ).toBeVisible();

    console.log("Wallet page loaded successfully");
  });

  test("should handle wallet API error", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/wallet/me/balance")) {
        return new Response(JSON.stringify({ error: "Server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/wallet/me/transactions")) {
        return new Response(
          JSON.stringify({
            Data: [],
            Total: 0,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
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
    await page.goto("/dashboard/wallet");
    await waitForPageReady(page);

    // Should show error message
    await expect(
      page.getByText(/Đã xảy ra một số lỗi khi cố tải dữ liệu ví/i)
    ).toBeVisible();

    console.log("Wallet error handled gracefully");
  });
});
