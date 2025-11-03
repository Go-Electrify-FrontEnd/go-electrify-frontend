import type { Page } from "@playwright/test";

/**
 * Mock data for admin user authentication
 * This simulates an authenticated admin session without real email flow
 */
export const mockAdminUser = {
  id: 1,
  email: "admin@test.local",
  name: "Test Admin",
  role: "admin",
  token: "mock-jwt-token-for-testing",
};

/**
 * Mock data for driver user authentication
 */
export const mockDriverUser = {
  id: 2,
  email: "driver@test.local",
  name: "Test Driver",
  role: "driver",
  token: "mock-jwt-token-driver",
};

/**
 * Setup authentication state for testing
 * Creates cookies and session storage to simulate logged-in user
 */
export async function setupAuthState(page: Page, user = mockAdminUser) {
  // Set up authentication cookies
  await page.context().addCookies([
    {
      name: "auth-token",
      value: user.token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // Set up user data in localStorage if needed
  await page.addInitScript((userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
  }, user);
}

/**
 * Mock API responses for authentication endpoints
 */
export function mockAuthEndpoints(request: Request) {
  const url = new URL(request.url);

  // Mock auth verification endpoint
  if (url.pathname.includes("/auth/verify") || url.pathname.includes("/auth/me")) {
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

  // Mock token refresh endpoint
  if (url.pathname.includes("/auth/refresh")) {
    return new Response(
      JSON.stringify({
        token: mockAdminUser.token,
        refreshToken: "mock-refresh-token",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return "continue";
}

/**
 * Wait for page to be fully loaded and hydrated
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Common data-testid selectors for consistency
 */
export const selectors = {
  sectionHeader: '[data-testid="section-header"]',
  sectionContent: '[data-testid="section-content"]',
  dataTable: '[data-testid="data-table"]',
  createButton: '[data-testid="create-button"]',
  editButton: '[data-testid="edit-button"]',
  deleteButton: '[data-testid="delete-button"]',
  searchInput: '[data-testid="search-input"]',
  filterDropdown: '[data-testid="filter-dropdown"]',
};
