"use server";

import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";
import { updateTag } from "next/cache";
import {
  chargerCreateSchema,
  chargerUpdateSchema,
} from "@/features/chargers/schemas/charger.request";
import { API_BASE_URL } from "@/lib/api-config";

/**
 * Generate a cryptographically secure random secret key
 */
function generateSecretKey(length = 32): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let result = "";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i]! % charset.length];
  }
  return result;
}

export async function createCharger(prevState: unknown, formData: FormData) {
  const { user, token } = await getUser();
  if (
    !user ||
    (!user.role.toLowerCase().includes("staff") &&
      !user.role.toLowerCase().includes("admin"))
  ) {
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

  // Generate a secure secret key
  const dockSecretHash = generateSecretKey(32);

  try {
    const url = `${API_BASE_URL}/chargers`;
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
        DockSecretHash: dockSecretHash,
      }),
    });

    if (response.ok) {
      updateTag("chargers");
      return {
        success: true,
        msg: "Sạc điện đã được tạo thành công",
        data: {
          secretKey: dockSecretHash,
        },
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
  if (
    !user ||
    !user.role.toLowerCase().includes("admin") ||
    !user.role.toLowerCase().includes("staff")
  ) {
    forbidden();
  }

  const { success, data, error } = chargerUpdateSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    connectorTypeId: String(formData.get("connectorTypeId") ?? ""),
    code: String(formData.get("code") ?? ""),
    powerKw: String(formData.get("powerKw") ?? ""),
    status: String(formData.get("status") ?? ""),
    pricePerKwh: String(formData.get("pricePerKwh") ?? ""),
  });

  if (!success) {
    console.error("updateCharger validation error:", JSON.stringify(error));
    return { success: false, msg: "Vui lòng kiểm tra lại dữ liệu" };
  }

  const url = `${API_BASE_URL}/chargers/${encodeURIComponent(data.id)}`;

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

export async function regenerateDockSecret(
  prevState: unknown,
  formData: FormData,
) {
  const { user, token } = await getUser();
  if (!user || !user.role.toLowerCase().includes("admin")) {
    forbidden();
  }

  const chargerId = String(formData.get("chargerId") ?? "");
  if (!chargerId) {
    return {
      success: false,
      msg: "ID trụ sạc không hợp lệ",
    };
  }

  // Generate a new secure secret key
  const newDockSecretHash = generateSecretKey(32);

  try {
    const url = `${API_BASE_URL}/chargers/${encodeURIComponent(chargerId)}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        DockSecretHash: newDockSecretHash,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        success: false,
        msg: err.message || "Không thể tạo lại khóa bí mật",
      };
    }

    updateTag("chargers");
    return {
      success: true,
      msg: "Khóa bí mật đã được tạo lại thành công",
      data: {
        secretKey: newDockSecretHash,
      },
    };
  } catch (error) {
    console.error("regenerateDockSecret error", error);
    return {
      success: false,
      msg: "Lỗi kết nối. Vui lòng thử lại",
    };
  }
}
