import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, mockDriverUser, waitForPageReady } from "./test-utils";

// Mock data for reservations
const mockReservations = [
  {
    Id: 1,
    StationId: 101,
    StationName: "Station Alpha",
    ChargerId: 201,
    VehicleModelId: 1,
    VehicleModelName: "Tesla Model 3",
    ConnectorTypeId: 1,
    ConnectorTypeName: "Type 2",
    Status: "CONFIRMED",
    BookingTime: "2024-02-15T10:00:00Z",
    StartTime: "2024-02-15T10:00:00Z",
    EndTime: "2024-02-15T12:00:00Z",
    EstimatedCost: 50000,
  },
  {
    Id: 2,
    StationId: 102,
    StationName: "Station Beta",
    ChargerId: 202,
    VehicleModelId: 2,
    VehicleModelName: "VinFast VF e34",
    ConnectorTypeId: 1,
    ConnectorTypeName: "Type 2",
    Status: "COMPLETED",
    BookingTime: "2024-02-10T14:00:00Z",
    StartTime: "2024-02-10T14:00:00Z",
    EndTime: "2024-02-10T16:00:00Z",
    EstimatedCost: 40000,
  },
];

const mockStations = [
  { Id: 101, Name: "Station Alpha", Address: "123 Main St" },
  { Id: 102, Name: "Station Beta", Address: "456 Park Ave" },
];

const mockVehicleModels = [
  { Id: 1, Brand: "Tesla", Model: "Model 3" },
  { Id: 2, Brand: "VinFast", Model: "VF e34" },
];

const mockConnectorTypes = [
  { Id: 1, Name: "Type 2" },
  { Id: 2, Name: "CCS" },
];

const mockBookingFee = {
  Id: 1,
  Type: "FLAT",
  Value: 10000,
};

test.describe("Driver Reservations Page", () => {
  test("should render reservations page with current and history sections", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/reservations")) {
        return new Response(JSON.stringify(mockReservations), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations")) {
        return new Response(JSON.stringify(mockStations), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/vehicle-models")) {
        return new Response(JSON.stringify(mockVehicleModels), {
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

      if (url.pathname.includes("/booking-fee")) {
        return new Response(JSON.stringify(mockBookingFee), {
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
    await page.goto("/dashboard/reservations");
    await waitForPageReady(page);

    // Verify page title
    await expect(
      page.getByRole("heading", { name: /Quản lý Đặt Chỗ/i })
    ).toBeVisible();

    // Verify current reservation card
    await expect(page.getByText(/Đặt Chỗ Hiện Tại/i)).toBeVisible();

    // Verify history section
    await expect(page.getByText(/Lịch Sử Đặt Chỗ/i)).toBeVisible();

    console.log("Reservations page loaded successfully");
  });

  test("should display empty state when no current reservation", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/reservations")) {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations")) {
        return new Response(JSON.stringify(mockStations), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/vehicle-models")) {
        return new Response(JSON.stringify(mockVehicleModels), {
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

      if (url.pathname.includes("/booking-fee")) {
        return new Response(JSON.stringify(mockBookingFee), {
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
    await page.goto("/dashboard/reservations");
    await waitForPageReady(page);

    // Should show empty state
    await expect(
      page.getByText(/Không có đặt chỗ hiện tại/i)
    ).toBeVisible();

    console.log("Empty reservation state displayed correctly");
  });

  test("should handle API errors gracefully", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/reservations")) {
        return new Response(JSON.stringify({ error: "Server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations")) {
        return new Response(JSON.stringify(mockStations), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/vehicle-models")) {
        return new Response(JSON.stringify(mockVehicleModels), {
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

      if (url.pathname.includes("/booking-fee")) {
        return new Response(JSON.stringify(mockBookingFee), {
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
    await page.goto("/dashboard/reservations");
    await waitForPageReady(page);

    // Page should still render header
    await expect(
      page.getByRole("heading", { name: /Quản lý Đặt Chỗ/i })
    ).toBeVisible();

    console.log("API error handled gracefully");
  });
});
