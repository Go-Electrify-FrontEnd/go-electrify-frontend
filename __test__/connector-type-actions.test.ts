import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock server-only and next utilities before importing the actions
vi.mock("@/lib/auth/auth-server", () => ({
  getUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  forbidden: vi.fn(() => {
    throw new Error("forbidden");
  }),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";
import { revalidateTag } from "next/cache";

import {
  handleCreateConnectorType,
  handleDeleteConnectorType,
  handleUpdateConnectorType,
} from "@/actions/connector-type-actions";

function makeFormData(values: Record<string, unknown>) {
  return {
    get: (key: string) => values[key],
  } as unknown as FormData;
}

describe("connector-type-actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore any global stubs like fetch
    try {
      vi.unstubAllGlobals();
    } catch {
      // ignore if not stubbed
    }
  });

  // -------- handleCreateConnectorType --------
  it("throws forbidden when not authenticated (create)", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: null,
      token: null,
    });

    await expect(
      handleCreateConnectorType(
        null,
        makeFormData({ name: "A", maxPowerKw: "10" }),
      ),
    ).rejects.toThrow("forbidden");
    expect(forbidden).toHaveBeenCalled();
  });

  it("returns validation error when create data invalid", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });

    const res = await handleCreateConnectorType(
      null,
      makeFormData({ description: "desc", maxPowerKw: "10" }),
    );

    expect(res.success).toBe(false);
    expect(String(res.msg)).toContain("Tên cổng kết nối là bắt buộc");
  });

  it("handles network error during create", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("net")));

    const res = await handleCreateConnectorType(
      null,
      makeFormData({ name: "A", description: "B", maxPowerKw: "10" }),
    );

    expect(res.success).toBe(false);
    expect(String(res.msg)).toContain("Lỗi mạng hoặc máy chủ.");
  });

  it("handles non-OK response during create", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const res = await handleCreateConnectorType(
      null,
      makeFormData({ name: "A", description: "B", maxPowerKw: "10" }),
    );

    expect(res.success).toBe(false);
    expect(String(res.msg)).toContain("Không thể tạo loại cổng kết nối");
  });

  it("creates connector type on success and revalidates tag", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    const res = await handleCreateConnectorType(
      null,
      makeFormData({ name: "A", description: "B", maxPowerKw: "10" }),
    );

    expect(res.success).toBe(true);
    expect(String(res.msg)).toContain("Tạo loại cổng kết nối thành công");
    expect(revalidateTag).toHaveBeenCalledWith("connector-types");
  });

  // -------- handleDeleteConnectorType --------
  it("throws forbidden when not authenticated (delete)", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: null,
      token: null,
    });

    await expect(
      handleDeleteConnectorType(null, makeFormData({ id: "abc" })),
    ).rejects.toThrow("forbidden");
    expect(forbidden).toHaveBeenCalled();
  });

  it("returns validation error when delete id invalid", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });

    const res = await handleDeleteConnectorType(null, makeFormData({ id: "" }));
    expect(res.success).toBe(false);
    expect(String(res.msg)).toContain("ID cổng kết nối là bắt buộc");
  });

  it("handles network error during delete", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("net")));

    const res = await handleDeleteConnectorType(
      null,
      makeFormData({ id: "abc" }),
    );
    expect(res.success).toBe(false);
    expect(String(res.msg)).toContain("Lỗi mạng hoặc máy chủ.");
  });

  it("handles non-OK response during delete", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const res = await handleDeleteConnectorType(
      null,
      makeFormData({ id: "abc" }),
    );
    expect(res.success).toBe(false);
    expect(String(res.msg)).toContain("Không thể xóa loại cổng kết nối");
  });

  it("deletes connector type on success and revalidates tag", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    const res = await handleDeleteConnectorType(
      null,
      makeFormData({ id: "abc" }),
    );
    expect(res.success).toBe(true);
    expect(String(res.msg)).toContain("Xóa loại cổng kết nối thành công");
    expect(revalidateTag).toHaveBeenCalledWith("connector-types");
  });

  // -------- handleUpdateConnectorType --------
  it("throws forbidden when not authenticated (update)", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: null,
      token: null,
    });

    await expect(
      handleUpdateConnectorType(
        null,
        makeFormData({ id: "abc", name: "N", maxPowerKw: "10" }),
      ),
    ).rejects.toThrow("forbidden");
    expect(forbidden).toHaveBeenCalled();
  });

  it("returns validation error when update data invalid", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });

    // Missing id should trigger the ID validation
    const res = await handleUpdateConnectorType(
      null,
      makeFormData({ id: "", name: "N", maxPowerKw: "10" }),
    );
    expect(res.success).toBe(false);
    expect(String(res.msg)).toContain("ID cổng kết nối là bắt buộc");
  });

  it("handles network error during update", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("net")));

    const res = await handleUpdateConnectorType(
      null,
      makeFormData({
        id: "abc",
        name: "N",
        description: "D",
        maxPowerKw: "10",
      }),
    );

    expect(res.success).toBe(false);
    expect(String(res.msg)).toContain("Lỗi mạng hoặc máy chủ.");
  });

  it("handles non-OK response during update", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const res = await handleUpdateConnectorType(
      null,
      makeFormData({
        id: "abc",
        name: "N",
        description: "D",
        maxPowerKw: "10",
      }),
    );

    expect(res.success).toBe(false);
    expect(String(res.msg)).toContain("Không thể cập nhật loại cổng kết nối");
  });

  it("updates connector type on success and revalidates tag", async () => {
    (getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { uid: 1 },
      token: "t",
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    const res = await handleUpdateConnectorType(
      null,
      makeFormData({
        id: "abc",
        name: "N",
        description: "D",
        maxPowerKw: "10",
      }),
    );

    expect(res.success).toBe(true);
    expect(String(res.msg)).toContain("Cập nhật loại cổng kết nối thành công");
    expect(revalidateTag).toHaveBeenCalledWith("connector-types");
  });
});
