import { test, expect } from "next/experimental/testmode/playwright";
import { setupAuthState, mockAdminUser, waitForPageReady } from "./test-utils";

// Mock data for incident reports
const mockIncidentReports = [
  {
    Id: 1,
    ReporterName: "John Doe",
    StationId: 101,
    StationName: "Station Alpha",
    ChargerId: 201,
    ReporterUserId: 1,
    Title: "Charger not working",
    Description: "The charger does not start when connected",
    Severity: "high",
    Status: "open",
    ReportedAt: "2024-01-15T08:30:00Z",
    ResolvedAt: null,
  },
  {
    Id: 2,
    ReporterName: "Jane Smith",
    StationId: 102,
    StationName: "Station Beta",
    ChargerId: 202,
    ReporterUserId: 2,
    Title: "Slow charging speed",
    Description: "Charging speed is significantly slower than expected",
    Severity: "medium",
    Status: "in_progress",
    ReportedAt: "2024-01-14T14:20:00Z",
    ResolvedAt: null,
  },
  {
    Id: 3,
    ReporterName: "Bob Johnson",
    StationId: 103,
    StationName: "Station Gamma",
    ChargerId: 203,
    ReporterUserId: 3,
    Title: "Connector damaged",
    Description: "The Type 2 connector appears to be physically damaged",
    Severity: "critical",
    Status: "resolved",
    ReportedAt: "2024-01-10T10:15:00Z",
    ResolvedAt: "2024-01-12T16:45:00Z",
  },
  {
    Id: 4,
    ReporterName: "Alice Brown",
    StationId: 101,
    StationName: "Station Alpha",
    ChargerId: 204,
    ReporterUserId: 4,
    Title: "Display not working",
    Description: "The charger display is blank and shows no information",
    Severity: "low",
    Status: "open",
    ReportedAt: "2024-01-16T11:00:00Z",
    ResolvedAt: null,
  },
];

test.describe("Admin Incident Reports Page", () => {
  test("should render incident reports management page with table", async ({
    page,
    next,
  }) => {
    // Mock API calls
    next.onFetch((request) => {
      const url = new URL(request.url);

      // Mock incident reports endpoint
      if (url.pathname.includes("/incidents") || url.pathname.includes("/admin/incidents")) {
        return new Response(JSON.stringify(mockIncidentReports), {
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

    // Navigate to incident reports page
    await page.goto("/dashboard/admin/incident-reports");

    // Wait for page to load
    await waitForPageReady(page);

    // Verify page title is visible
    await expect(
      page.getByRole("heading", { name: /Quản lý Sự Cố Báo Cáo/i })
    ).toBeVisible();

    // Verify subtitle is visible
    await expect(
      page.getByText(/Theo dõi và xử lý các sự cố được báo cáo/i)
    ).toBeVisible();

    // Wait for table to be visible
    await page.waitForSelector("table", { timeout: 10000 });

    // Verify table is rendered
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // Verify at least one incident report is displayed in the table
    const tableRows = page.locator("tbody tr");
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);

    console.log(
      `Incident reports page loaded successfully with ${rowCount} reports`
    );
  });

  test("should display incident report data in table", async ({
    page,
    next,
  }) => {
    // Mock API calls
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/incidents") || url.pathname.includes("/admin/incidents")) {
        return new Response(JSON.stringify(mockIncidentReports), {
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
    await page.goto("/dashboard/admin/incident-reports");
    await waitForPageReady(page);

    // Wait for table to be populated
    await page.waitForSelector("table tbody tr", { timeout: 10000 });

    // Verify specific incident report data is displayed
    const firstReport = mockIncidentReports[0];
    await expect(page.getByText(firstReport.Title)).toBeVisible();

    console.log("Incident report data displayed correctly in table");
  });

  test("should display different incident severities", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/incidents") || url.pathname.includes("/admin/incidents")) {
        return new Response(JSON.stringify(mockIncidentReports), {
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
    await page.goto("/dashboard/admin/incident-reports");
    await waitForPageReady(page);

    // Wait for table to be populated
    await page.waitForSelector("table tbody tr", { timeout: 10000 });

    // Verify various incident titles are displayed (representing different severities)
    await expect(page.getByText("Charger not working")).toBeVisible();
    await expect(page.getByText("Connector damaged")).toBeVisible();

    console.log("Different incident severities displayed correctly");
  });

  test("should display different incident statuses", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/incidents") || url.pathname.includes("/admin/incidents")) {
        return new Response(JSON.stringify(mockIncidentReports), {
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
    await page.goto("/dashboard/admin/incident-reports");
    await waitForPageReady(page);

    // Wait for table to be populated
    await page.waitForSelector("table tbody tr", { timeout: 10000 });

    // Verify that the table has rows with different statuses
    const tableRows = page.locator("tbody tr");
    const rowCount = await tableRows.count();
    
    // Should have multiple incidents with different statuses (open, in_progress, resolved)
    expect(rowCount).toBe(mockIncidentReports.length);

    console.log("Different incident statuses handled correctly");
  });

  test("should handle empty incident reports list gracefully", async ({
    page,
    next,
  }) => {
    // Mock API with empty incident reports list
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/incidents") || url.pathname.includes("/admin/incidents")) {
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
    await page.goto("/dashboard/admin/incident-reports");
    await waitForPageReady(page);

    // Page should still render with header
    await expect(
      page.getByRole("heading", { name: /Quản lý Sự Cố Báo Cáo/i })
    ).toBeVisible();

    console.log("Empty incident reports list handled gracefully");
  });

  test("should handle API error gracefully", async ({ page, next }) => {
    // Mock API with error response
    next.onFetch((request) => {
      const url = new URL(request.url);

      if (url.pathname.includes("/incidents") || url.pathname.includes("/admin/incidents")) {
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
    await page.goto("/dashboard/admin/incident-reports");
    await waitForPageReady(page);

    // Page should still render header even with API error
    await expect(
      page.getByRole("heading", { name: /Quản lý Sự Cố Báo Cáo/i })
    ).toBeVisible();

    console.log("API error handled gracefully");
  });
});
