"use server";

import { getUser } from "@/lib/auth/auth-server";
import { updateTag } from "next/cache";
import { reservationFormSchema } from "@/lib/zod/reservation/reservation.request";

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
    const url = "https://api.go-electrify.com/api/v1/bookings";
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
      return { success: false, msg: "Tạo đặt chỗ thất bại" };
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    return { success: false, msg: "Đã xảy ra lỗi khi tạo đặt chỗ" };
  }
}
