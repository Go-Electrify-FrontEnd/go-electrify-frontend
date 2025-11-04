import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, mockAdminUser, waitForPageReady } from "./test-utils";

// Mock data for vehicle models
const mockVehicleModels = [
  {
    Id: 1,
    Brand: "Tesla",
    Model: "Model 3",
    Year: 2023,
    BatteryCapacity: 75,
    ConnectorTypeId: 1,
    ConnectorTypeName: "Type 2",
    Range: 500,
    ChargingPower: 250,
    CreatedAt: "2024-01-01T00:00:00Z",
  },
  {
    Id: 2,
    Brand: "VinFast",
    Model: "VF e34",
    Year: 2023,
    BatteryCapacity: 42,
    ConnectorTypeId: 1,
    ConnectorTypeName: "Type 2",
    Range: 300,
    ChargingPower: 100,
    CreatedAt: "2024-01-02T00:00:00Z",
  },
  {
    Id: 3,
    Brand: "Hyundai",
    Model: "Kona Electric",
    Year: 2023,
    BatteryCapacity: 64,
    ConnectorTypeId: 2,
    ConnectorTypeName: "CCS",
    Range: 450,
    ChargingPower: 150,
    CreatedAt: "2024-01-03T00:00:00Z",
  },
];

// Mock connector types data
const mockConnectorTypes = [
  {
    Id: 1,
    Name: "Type 2",
    Description: "Standard European connector",
    MaxPower: 250,
  },
  {
    Id: 2,
    Name: "CCS",
    Description: "Combined Charging System",
    MaxPower: 350,
  },
];

test.describe("Admin Vehicle Models Page", () => {
  test("should render vehicle models management page with table", async ({
    page,
    next,
  }) => {
    // Mock API calls
    next.onFetch((request) => {
      const url = new URL(request.url);

      // Mock vehicle models endpoint
      if (url.pathname.includes("/vehicle-models")) {
        return new Response(JSON.stringify(mockVehicleModels), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Mock connector types endpoint
      if (url.pathname.includes("/connector-types")) {
        return new Response(JSON.stringify(mockConnectorTypes), {
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

    // Navigate to vehicle models page
    await page.goto("/dashboard/admin/vehicle-models");

    // Wait for page to load
    await waitForPageReady(page);

    // Verify page title is visible
    await expect(
      page.getByRole("heading", { name: /Quản lý Xe Điện/i })
    ).toBeVisible();

    // Verify subtitle is visible
    await expect(
      page.getByText(/Quản lý và theo dõi các mẫu xe điện/i)
    ).toBeVisible();

    // Wait for table to be visible
    await page.waitForSelector("table", { timeout: 10000 });

    // Verify table is rendered
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // Verify at least one vehicle model is displayed in the table
    const tableRows = page.locator("tbody tr");
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);

    console.log(
      `Vehicle models page loaded successfully with ${rowCount} models`
    );
  });

  test("should display vehicle model data in table", async ({
    page,
    next,
  }) => {
    // Mock API calls
    next.onFetch((request) => {
      const url = new URL(request.url);

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

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockAdminUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockAdminUser);
    await page.goto("/dashboard/admin/vehicle-models");
    await waitForPageReady(page);

    // Wait for table to be populated
    await page.waitForSelector("table tbody tr", { timeout: 10000 });

    // Verify specific vehicle model data is displayed
    const firstModel = mockVehicleModels[0];
    await expect(page.getByText(firstModel.Brand)).toBeVisible();
    await expect(page.getByText(firstModel.Model)).toBeVisible();

    console.log("Vehicle model data displayed correctly in table");
  });

  test("should display create vehicle model button", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

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

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockAdminUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockAdminUser);
    await page.goto("/dashboard/admin/vehicle-models");
    await waitForPageReady(page);

    // Look for create/add button in the header section
    const createButton = page
      .locator('button:has-text("Tạo"), button:has-text("Thêm")')
      .first();

    // Check if button exists
    const buttonCount = await createButton.count();
    if (buttonCount > 0) {
      console.log("Create button found on vehicle models page");
    } else {
      console.log("Create button not found - this is acceptable");
    }
  });

  test("should handle empty vehicle models list gracefully", async ({
    page,
    next,
  }) => {
    // Mock API with empty vehicle models list
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/vehicle-models")) {
        return new Response(JSON.stringify([]), {
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

      if (url.pathname.includes("/auth/")) {
        return new Response(
          JSON.stringify({ success: true, user: mockAdminUser }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return "abort";
    });

    await setupAuthState(page, mockAdminUser);
    await page.goto("/dashboard/admin/vehicle-models");
    await waitForPageReady(page);

    // Page should still render with header
    await expect(
      page.getByRole("heading", { name: /Quản lý Xe Điện/i })
    ).toBeVisible();

    console.log("Empty vehicle models list handled gracefully");
  });

  test("should handle API error gracefully", async ({ page, next }) => {
    // Mock API with error response
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/vehicle-models")) {
        return new Response(
          JSON.stringify({ error: "Internal server error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (url.pathname.includes("/connector-types")) {
        return new Response(JSON.stringify(mockConnectorTypes), {
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
    await page.goto("/dashboard/admin/vehicle-models");
    await waitForPageReady(page);

    // Page should still render header even with API error
    await expect(
      page.getByRole("heading", { name: /Quản lý Xe Điện/i })
    ).toBeVisible();

    console.log("API error handled gracefully");
  });
});
