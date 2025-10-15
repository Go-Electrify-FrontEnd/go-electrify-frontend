import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("next/headers", () => {
  return {
    cookies: vi.fn(),
  };
});

vi.mock("next/navigation", () => {
  return {
    redirect: vi.fn(),
  };
});

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { handleLogin, handleVerifyOTP } from "@/actions/login-actions";

describe("login-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  const makeFormData = (map: Record<string, string>) =>
    ({
      get: (k: string) => map[k],
    }) as FormData;

  it("testHandleLoginReturnsSuccessOnOkResponse", async () => {
    const email = "user@example.com";
    const fd = makeFormData({ email });

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
    });

    const result = await handleLogin(undefined, fd);

    expect(result).toEqual({
      success: true,
      msg: "Mã OTP đã được gửi đến email của bạn",
    });
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.go-electrify.com/api/v1/auth/request-otp",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email }),
      }),
    );
  });

  it("testHandleVerifyOtpSetsCookiesAndRedirectsOnValidResponse", async () => {
    const cookieStore = {
      get: vi.fn().mockReturnValue(undefined),
      set: vi.fn(),
    };
    (cookies as ReturnType<typeof vi.fn>).mockResolvedValue(cookieStore);

    const accessToken = "access-token";
    const refreshToken = "refresh-token";
    const accessExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const refreshExpires = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        AccessToken: accessToken,
        RefreshToken: refreshToken,
        AccessExpires: accessExpires,
        RefreshExpires: refreshExpires,
      }),
    });

    const fd = makeFormData({ email: "user@example.com", code: "123456" });

    const result = await handleVerifyOTP(undefined, fd);

    expect(result).toEqual({ success: true, msg: "" });

    expect(cookieStore.set).toHaveBeenCalledTimes(2);
    expect(cookieStore.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "accessToken",
        value: accessToken,
        httpOnly: true,
        maxAge: 60 * 15,
      }),
    );
    expect(cookieStore.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "refreshToken",
        value: refreshToken,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      }),
    );
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("testHandleVerifyOtpReturnsAlreadyAuthenticatedWhenTokensPresent", async () => {
    const cookieStore = {
      get: vi
        .fn()
        .mockImplementation((name: string) => ({ name, value: "exists" })),
      set: vi.fn(),
    };
    (cookies as ReturnType<typeof vi.fn>).mockResolvedValue(cookieStore);

    const fd = makeFormData({ email: "user@example.com", code: "123456" });

    const result = await handleVerifyOTP(undefined, fd);

    expect(result).toEqual({
      success: true,
      msg: "Bạn đã đăng nhập",
    });
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("testHandleLoginReturnsEmailRequiredWhenMissing", async () => {
    const fd = makeFormData({});

    const result = await handleLogin(undefined, fd);

    expect(result).toEqual({
      success: false,
      msg: "Email là bắt buộc",
    });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("testHandleVerifyOtpReturnsInvalidOnNonOkResponseWithoutRedirect", async () => {
    const cookieStore = {
      get: vi.fn().mockReturnValue(undefined),
      set: vi.fn(),
    };
    (cookies as ReturnType<typeof vi.fn>).mockResolvedValue(cookieStore);

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
    });

    const fd = makeFormData({ email: "user@example.com", code: "654321" });

    const result = await handleVerifyOTP(undefined, fd);

    expect(result).toEqual({
      success: false,
      msg: "Mã OTP không hợp lệ hoặc đã hết hạn",
      user: null,
      tokens: null,
    });
    expect(cookieStore.set).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("testHandleVerifyOtpReturnsNetworkErrorAndNoRedirectOnFetchFailure", async () => {
    const cookieStore = {
      get: vi.fn().mockReturnValue(undefined),
      set: vi.fn(),
    };
    (cookies as ReturnType<typeof vi.fn>).mockResolvedValue(cookieStore);

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("network down"),
    );

    const fd = makeFormData({ email: "user@example.com", code: "654321" });

    const result = await handleVerifyOTP(undefined, fd);

    expect(result).toEqual({
      success: false,
      msg: "Lỗi kết nối. Vui lòng thử lại",
      user: null,
      tokens: null,
    });
    expect(redirect).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
