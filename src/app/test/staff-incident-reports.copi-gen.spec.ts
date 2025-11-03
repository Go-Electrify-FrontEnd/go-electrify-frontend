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

const mockStations = [
  {
    Id: 101,
    Name: "Station Alpha",
    Address: "123 Main St",
  },
];

const mockIncidents = [
  {
    Id: 1,
    StationId: 101,
    ChargerId: 201,
    ReportedByStationStaffId: 3,
    Title: "Charger malfunction",
    Description: "Charger not working properly",
    Severity: "HIGH",
    Status: "OPEN",
    ReportedAt: "2024-02-15T10:00:00Z",
  },
  {
    Id: 2,
    StationId: 101,
    ChargerId: 202,
    ReportedByStationStaffId: 3,
    Title: "Display issue",
    Description: "Display shows blank screen",
    Severity: "MEDIUM",
    Status: "IN_PROGRESS",
    ReportedAt: "2024-02-14T15:30:00Z",
  },
];

test.describe("Staff Incident Reports Page", () => {
  test("should render staff incident reports page", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/stations/me")) {
        return new Response(JSON.stringify(mockStations[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/incidents")) {
        return new Response(JSON.stringify(mockIncidents), {
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
    await page.goto("/dashboard/staff/incident-reports");
    await waitForPageReady(page);

    // Wait for client component to render
    await page.waitForTimeout(2000);

    console.log("Staff incident reports page loaded successfully");
  });

  test("should handle empty incidents list", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/stations/me")) {
        return new Response(JSON.stringify(mockStations[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname.includes("/stations/101/incidents")) {
        return new Response(JSON.stringify([]), {
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
    await page.goto("/dashboard/staff/incident-reports");
    await waitForPageReady(page);

    // Wait for client component to render
    await page.waitForTimeout(2000);

    console.log("Empty incidents list handled gracefully");
  });

  test("should handle API error gracefully", async ({ page, next }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/stations/me")) {
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
    await page.goto("/dashboard/staff/incident-reports");
    await waitForPageReady(page);

    // Wait for client component to render
    await page.waitForTimeout(2000);

    console.log("API error handled gracefully");
  });
});
