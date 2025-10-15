import { describe, it, expect, beforeEach, vi } from "vitest";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

vi.mock("@/lib/auth/auth-middleware", () => ({
  handleAuthRefresh: vi.fn(),
}));

vi.mock("@/lib/auth/auth-server", () => ({
  getUserFromToken: vi.fn(),
}));

vi.mock("next/server", () => {
  function createCookieStore() {
    const store = new Map<string, string>();
    const deleted: string[] = [];
    return {
      get: (name: string) =>
        store.has(name) ? { name, value: store.get(name)! } : undefined,
      set: (name: string, value: string) => {
        store.set(name, value);
      },
      delete: (name: string) => {
        store.delete(name);
        deleted.push(name);
      },
      _all: store,
      _deleted: deleted,
    };
  }

  const redirect = vi.fn((url: URL | string) => {
    return {
      cookies: createCookieStore(),
      redirected: true,
      location: url instanceof URL ? url.toString() : String(url),
    };
  });

  return {
    NextResponse: {
      redirect,
    },
  };
});

// Import the mocked helpers and the module under test AFTER jest.mock calls
import { handleAuthRefresh } from "@/lib/auth/auth-middleware";
import { getUserFromToken } from "@/lib/auth/auth-server";
import { middleware } from "@/middleware";

function createMockResponse() {
  const store = new Map<string, string>();
  const deleted: string[] = [];
  return {
    cookies: {
      get: (name: string) =>
        store.has(name) ? { name, value: store.get(name)! } : undefined,
      set: (name: string, value: string) => {
        store.set(name, value);
      },
      delete: (name: string) => {
        store.delete(name);
        deleted.push(name);
      },
      _all: store,
      _deleted: deleted,
    },
  };
}

function createRequest(
  pathname: string,
  cookieValues?: Record<string, string>,
) {
  const cookieMap = new Map<string, string>(Object.entries(cookieValues ?? {}));
  return {
    nextUrl: { pathname },
    cookies: {
      get: (name: string) =>
        cookieMap.has(name) ? { value: cookieMap.get(name)! } : undefined,
    },
    url: `https://example.com${pathname}`,
  } as unknown as NextRequest;
}

describe("middleware", () => {
  const mockedHandleAuthRefresh = handleAuthRefresh as ReturnType<typeof vi.fn>;
  const mockedGetUserFromToken = getUserFromToken as ReturnType<typeof vi.fn>;
  const mockedRedirect = (
    NextResponse as unknown as { redirect: ReturnType<typeof vi.fn> }
  ).redirect;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allowsProtectedRouteWithValidAccessToken", async () => {
    const req = createRequest("/dashboard", { accessToken: "valid-token" });
    const passthroughResponse = createMockResponse();

    mockedHandleAuthRefresh.mockResolvedValue(passthroughResponse);
    mockedGetUserFromToken.mockResolvedValue({
      user: { uid: "1", email: "a@b.com", role: "user", name: "A", avatar: "" },
    });

    const res = await middleware(req);

    expect(res).toBe(passthroughResponse);
    expect(mockedRedirect).not.toHaveBeenCalled();
    expect(mockedHandleAuthRefresh).toHaveBeenCalledWith(req);
  });

  it("redirectsAuthenticatedUserFromLoginToDashboard", async () => {
    const req = createRequest("/login", { accessToken: "valid-token" });
    const passthroughResponse = createMockResponse();
    const redirectResponse = createMockResponse();

    mockedHandleAuthRefresh.mockResolvedValue(passthroughResponse);
    mockedGetUserFromToken.mockResolvedValue({
      user: { uid: "1", email: "a@b.com", role: "user", name: "A", avatar: "" },
    });
    mockedRedirect.mockImplementation(() => redirectResponse);

    const res = await middleware(req);

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    const redirectArg = mockedRedirect.mock.calls[0][0];
    expect(String(redirectArg)).toContain("/dashboard");
    expect(res).toBe(redirectResponse);
  });

  it("returnsPublicPathWithRefreshedCookies", async () => {
    const req = createRequest("/", {});
    const refreshedResponse = createMockResponse();
    refreshedResponse.cookies.set("accessToken", "new-access");
    refreshedResponse.cookies.set("refreshToken", "new-refresh");

    mockedHandleAuthRefresh.mockResolvedValue(refreshedResponse);
    mockedGetUserFromToken.mockResolvedValue({ user: null });

    const res = await middleware(req);

    expect(res).toBe(refreshedResponse);
    expect(res.cookies.get("accessToken")?.value).toBe("new-access");
    expect(res.cookies.get("refreshToken")?.value).toBe("new-refresh");
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("redirectsToLoginAndClearsCookiesWhenTokensInvalidOrMissingRefresh", async () => {
    const req = createRequest("/settings", {});
    const passthroughResponse = createMockResponse();
    const redirectResponse = createMockResponse();

    mockedHandleAuthRefresh.mockResolvedValue(passthroughResponse);
    mockedGetUserFromToken.mockResolvedValue({ user: null });
    mockedRedirect.mockImplementation(() => redirectResponse);

    const res = await middleware(req);

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    const redirectArg = mockedRedirect.mock.calls[0][0];
    expect(String(redirectArg)).toContain("/login");
    expect(res).toBe(redirectResponse);
    expect((res.cookies as unknown as { _deleted: string[] })._deleted).toEqual(
      expect.arrayContaining(["accessToken", "refreshToken"]),
    );
  });

  it("usesRefreshedAccessTokenFromResponseCookies", async () => {
    const req = createRequest("/protected", { accessToken: "old-access" });
    const refreshedResponse = createMockResponse();
    refreshedResponse.cookies.set("accessToken", "new-access");

    mockedHandleAuthRefresh.mockResolvedValue(refreshedResponse);
    mockedGetUserFromToken.mockResolvedValue({
      user: {
        uid: "2",
        email: "c@d.com",
        role: "admin",
        name: "C",
        avatar: "",
      },
    });

    const res = await middleware(req);

    expect(mockedGetUserFromToken).toHaveBeenCalledWith("new-access");
    expect(res).toBe(refreshedResponse);
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("allowsUnauthenticatedAccessToLoginWithoutRedirect", async () => {
    const req = createRequest("/login", {});
    const passthroughResponse = createMockResponse();

    mockedHandleAuthRefresh.mockResolvedValue(passthroughResponse);
    mockedGetUserFromToken.mockResolvedValue({ user: null });

    const res = await middleware(req);

    expect(res).toBe(passthroughResponse);
    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});
