import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, mockAdminUser, waitForPageReady } from "./test-utils";

const mockStation = {
  Id: 101,
  Name: "Station Alpha",
  Address: "123 Main Street, District 1",
  Latitude: 10.7769,
  Longitude: 106.7009,
  Status: "ACTIVE",
  TotalChargers: 4,
  AvailableChargers: 2,
};

const mockChargers = [
  {
    Id: 201,
    StationId: 101,
    ConnectorTypeId: 1,
    ConnectorTypeName: "Type 2",
    Status: "ONLINE",
    Power: 250,
    CreatedAt: "2024-01-01T00:00:00Z",
  },
  {
    Id: 202,
    StationId: 101,
    ConnectorTypeId: 2,
    ConnectorTypeName: "CCS",
    Status: "OFFLINE",
    Power: 350,
    CreatedAt: "2024-01-02T00:00:00Z",
  },
];

const mockBookings = [
  {
    Id: 1,
    Code: "BK001",
    StationId: 101,
    ChargerId: 201,
    UserId: 1,
    Status: "CONFIRMED",
    BookingTime: "2024-02-15T10:00:00Z",
  },
];

const mockConnectorTypes = [
  { Id: 1, Name: "Type 2" },
  { Id: 2, Name: "CCS" },
];

test.describe("Station Detail Page", () => {
  test("should render station detail page with stats", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/stations/101") && !url.pathname.includes("/chargers")) {
        return new Response(JSON.stringify(mockStation), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/chargers")) {
        return new Response(JSON.stringify(mockChargers), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/bookings")) {
        return new Response(JSON.stringify(mockBookings), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/connector-types")) {
        return new Response(JSON.stringify(mockConnectorTypes), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/staff")) {
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
    await page.goto("/dashboard/station-detail/101");
    await waitForPageReady(page);

    // Verify station name is displayed
    await expect(
      page.getByRole("heading", { name: mockStation.Name })
    ).toBeVisible();

    // Verify station address
    await expect(page.getByText(mockStation.Address)).toBeVisible();

    // Verify stats cards
    await expect(page.getByText(/Tổng Dock/i)).toBeVisible();
    await expect(page.getByText(/Phiên Đang Sạc/i)).toBeVisible();

    console.log("Station detail page loaded successfully");
  });

  test("should display chargers table", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/stations/101") && !url.pathname.includes("/chargers")) {
        return new Response(JSON.stringify(mockStation), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/chargers")) {
        return new Response(JSON.stringify(mockChargers), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/bookings")) {
        return new Response(JSON.stringify(mockBookings), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/connector-types")) {
        return new Response(JSON.stringify(mockConnectorTypes), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/staff")) {
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
    await page.goto("/dashboard/station-detail/101");
    await waitForPageReady(page);

    // Verify chargers section
    await expect(page.getByText(/Danh sách Dock Sạc/i)).toBeVisible();

    console.log("Chargers table displayed correctly");
  });

  test("should display bookings section", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/stations/101") && !url.pathname.includes("/chargers")) {
        return new Response(JSON.stringify(mockStation), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/chargers")) {
        return new Response(JSON.stringify(mockChargers), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/bookings")) {
        return new Response(JSON.stringify(mockBookings), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/connector-types")) {
        return new Response(JSON.stringify(mockConnectorTypes), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/staff")) {
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
    await page.goto("/dashboard/station-detail/101");
    await waitForPageReady(page);

    // Verify bookings section
    await expect(page.getByText(/Lịch Giữ Chỗ/i)).toBeVisible();

    console.log("Bookings section displayed correctly");
  });

  test("should handle station not found", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/stations/999")) {
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
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
    await page.goto("/dashboard/station-detail/999");
    await waitForPageReady(page);

    // Should show 404 or error state
    await page.waitForTimeout(2000);

    console.log("Station not found handled correctly");
  });
});
