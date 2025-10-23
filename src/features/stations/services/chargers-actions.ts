"use server";

import { getUser } from "@/lib/auth/auth-server";
import { chargerCreateSchema } from "@/lib/zod/charger/charger.request";
import { forbidden } from "next/navigation";
import { chargerUpdateSchema } from "@/lib/zod/charger/charger.request";
import { updateTag } from "next/cache";

export async function createCharger(prevState: unknown, formData: FormData) {
  const { user, token } = await getUser();
  if (!user || !user.role.toLowerCase().includes("admin")) {
    forbidden();
  }
  const rawEntries = Object.fromEntries(formData.entries());
  const parsed = chargerCreateSchema.safeParse(rawEntries);

  if (!parsed.success) {
    console.error("createCharger validation error:", parsed.error.format());
    const first = parsed.error.issues?.[0]?.message;
    return {
      success: false,
      msg: first || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại",
    };
  }

  const data = parsed.data;
  try {
    const url = "https://api.go-electrify.com/api/v1/chargers";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        StationId: data.stationId,
        ConnectorTypeId: data.connectorTypeId,
        Code: data.code,
        PowerKw: data.powerKw,
        Status: data.status,
        PricePerKwh: data.pricePerKwh,
        DockSecretHash: data.dockSecretHash,
      }),
    });

    if (response.ok) {
      updateTag("chargers");
      return {
        success: true,
        msg: "Sạc điện đã được tạo thành công",
      };
    }

    return {
      success: false,
      msg: "Không thể tạo sạc điện. Vui lòng thử lại",
    };
  } catch (error) {
    console.error("createCharger error", error);
    return {
      success: false,
      msg: "Lỗi kết nối. Vui lòng thử lại",
    };
  }
}

export async function updateCharger(prevState: unknown, formData: FormData) {
  const { user, token } = await getUser();
  if (!user || !user.role.toLowerCase().includes("admin")) {
    forbidden();
  }

  const parsed = chargerUpdateSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    connectorTypeId: String(formData.get("connectorTypeId") ?? ""),
    code: String(formData.get("code") ?? ""),
    powerKw: String(formData.get("powerKw") ?? ""),
    status: String(formData.get("status") ?? ""),
    pricePerKwh: String(formData.get("pricePerKwh") ?? ""),
  });

  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join("; ");
    console.error("updateCharger validation error:", parsed.error.flatten());
    return { success: false, msg: "Vui lòng kiểm tra lại dữ liệu" };
  }

  const data = parsed.data;

  const url = `https://api.go-electrify.com/api/v1/chargers/${encodeURIComponent(
    data.id,
  )}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ConnectorTypeId: data.connectorTypeId,
        Code: data.code,
        PowerKw: data.powerKw,
        Status: data.status,
        PricePerKwh: data.pricePerKwh,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, msg: err.message || "Cập nhật sạc thất bại" };
    }
  } catch (error) {
    console.error("updateCharger error", error);
    return { success: false, msg: "Lỗi kết nối. Vui lòng thử lại" };
  }

  updateTag("chargers");
  return { success: true, msg: "Cập nhật sạc thành công" };
}
