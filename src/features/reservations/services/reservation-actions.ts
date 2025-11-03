"use server";

import { getUser } from "@/lib/auth/auth-server";
import { API_BASE_URL } from "@/lib/api-config";
import { updateTag } from "next/cache";
import {
  reservationCancelSchema,
  reservationFormSchema,
} from "../schemas/reservation.request";

export async function createReservation(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    return { success: false, msg: "Người dùng chưa xác thực" };
  }

  const { success, data, error } = reservationFormSchema.safeParse({
    stationId: String(formData.get("stationId") ?? ""),
    vehicleModelId: String(formData.get("vehicleModelId") ?? ""),
    connectorTypeId: String(formData.get("connectorTypeId") ?? ""),
    initialSoc: formData.get("initialSoc"),
  });

  if (!success) {
    console.error("Validation error:", error);
    return { success: false, msg: "Dữ liệu không hợp lệ" };
  }

  const scheduledStart = new Date();
  scheduledStart.setMinutes(scheduledStart.getMinutes() + 60);

  try {
    const url = `${API_BASE_URL}/bookings`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        StationId: parseInt(data.stationId),
        VehicleModelId: parseInt(data.vehicleModelId),
        ConnectorTypeId: parseInt(data.connectorTypeId),
        InitialSoc: data.initialSoc,
        ScheduledStart: scheduledStart.toISOString(),
      }),
    });

    if (response.ok) {
      updateTag("reservations");
      return { success: true, msg: "Đặt chỗ đã được tạo thành công" };
    } else {
      const json = await response.json();
      return { success: false, msg: json.message };
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    return { success: false, msg: "Đã xảy ra lỗi khi tạo đặt chỗ" };
  }
}

export async function cancelReservation(prev: unknown, formData: FormData) {
  try {
    const { token } = await getUser();
    if (!token) {
      return { success: false, msg: "Người dùng chưa xác thực" };
    }

    const reservationId = formData.get("id") as string;
    const reason = formData.get("reason") as string;

    if (!reservationId) {
      return { success: false, msg: "ID đặt chỗ là bắt buộc" };
    }

    const { success, data, error } = reservationCancelSchema.safeParse({
      reason,
    });

    if (!success) {
      console.error("Validation error:", error);
      return { success: false, msg: "Dữ liệu không hợp lệ" };
    }

    const url = `${API_BASE_URL}/bookings/${reservationId}/cancel`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Reason: data.reason,
      }),
    });

    if (response.ok) {
      updateTag("reservations");
      return { success: true, msg: "Đặt chỗ đã được hủy thành công" };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        msg: errorData.message || `Không thể hủy đặt chỗ (${response.status})`,
      };
    }
  } catch (error) {
    console.error("Error canceling reservation:", error);
    return { success: false, msg: "Đã xảy ra lỗi khi hủy đặt chỗ" };
  }
}
