import type { Page } from "@playwright/test";
import * as jose from "jose";

/**
 * Mock data for admin user authentication
 * This simulates an authenticated admin session without real email flow
 */
export const mockAdminUser = {
  uid: "1",
  email: "admin@test.local",
  name: "Test Admin",
  role: "admin",
  avatar: null,
};

/**
 * Mock data for driver user authentication
 */
export const mockDriverUser = {
  uid: "2",
  email: "driver@test.local",
  name: "Test Driver",
  role: "driver",
  avatar: null,
};

/**
 * Generate a valid JWT token for testing
 * Uses the AUTH_SECRET_KEY environment variable if available, otherwise uses a test secret
 */
async function generateTestJWT(user: typeof mockAdminUser) {
  const secret = new TextEncoder().encode(
    process.env.AUTH_SECRET_KEY || "test-secret-key-for-testing-only"
  );
  
  const jwt = await new jose.SignJWT({
    uid: user.uid,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  return jwt;
}

/**
 * Setup authentication state for testing
 * Creates cookies with valid JWT tokens to simulate logged-in user
 */
export async function setupAuthState(page: Page, user = mockAdminUser) {
  const accessToken = await generateTestJWT(user);
  const refreshToken = await generateTestJWT(user); // In tests, we can use the same token

  // Set up authentication cookies with the correct names
  await page.context().addCookies([
    {
      name: "accessToken",
      value: accessToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
    {
      name: "refreshToken",
      value: refreshToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);
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
