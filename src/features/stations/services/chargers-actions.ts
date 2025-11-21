"use server";

import { getUser } from "@/lib/auth/auth-server";
import { hasRoles } from "@/lib/auth/role-check";
import { forbidden } from "next/navigation";
import { updateTag } from "next/cache";
import {
  chargerCreateSchema,
  chargerUpdateSchema,
} from "@/features/chargers/schemas/charger.request";
import { API_BASE_URL } from "@/lib/api-config";

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
  if (!user) {
    forbidden();
  }

  if (!hasRoles(user, ["staff", "admin"])) {
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
      const json = await response.json();
      updateTag("chargers");
      return {
        success: true,
        msg: "Sạc điện đã được tạo thành công",
        data: {
          secretKey: dockSecretHash,
          chargerId: json.Id as number,
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
  if (!user) {
    forbidden();
  }

  if (!hasRoles(user, ["admin", "staff"])) {
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
  if (!user) {
    forbidden();
  }

  if (!hasRoles(user, ["admin", "staff"])) {
    forbidden();
  }

  const chargerId = String(formData.get("chargerId") ?? "");
  if (!chargerId) {
    return {
      success: false,
      msg: "ID trụ sạc không hợp lệ",
    };
  }

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
        chargerId,
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
