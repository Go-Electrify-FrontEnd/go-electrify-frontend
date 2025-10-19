"use server";

import { getUser } from "@/lib/auth/auth-server";
import { chargerCreateSchema } from "@/lib/zod/charger/charger.request";
import { forbidden } from "next/navigation";

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
