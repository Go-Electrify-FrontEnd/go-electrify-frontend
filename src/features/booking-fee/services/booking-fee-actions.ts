"use server";

import { getUser } from "@/lib/auth/auth-server";
import { hasRole } from "@/lib/auth/role-check";
import { forbidden } from "next/navigation";
import { updateTag } from "next/cache";
import { bookingFeeUpdateSchema } from "../schemas/booking-fee.request";
import { API_BASE_URL, createJsonAuthHeaders } from "@/lib/api-config";

const BACKEND_URL = `${API_BASE_URL}/admin/booking-fee`;

export async function updateBookingFee(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();

  if (!user || !hasRole(user, "admin")) {
    forbidden();
  }

  const rawValue = formData.get("value");
  const parsedValue = rawValue ? parseFloat(String(rawValue)) : NaN;

  const { success, data, error } = bookingFeeUpdateSchema.safeParse({
    type: String(formData.get("type") ?? ""),
    value: parsedValue,
  });

  if (!success) {
    const msg = error.issues.map((issue) => issue.message).join("; ");
    return { success: false, msg };
  }

  let response;
  try {
    response = await fetch(BACKEND_URL, {
      method: "PUT",
      headers: createJsonAuthHeaders(token),
      body: JSON.stringify({
        Type: data.type,
        Value: data.value,
      }),
    });
  } catch (err: unknown) {
    console.error(err);
    return { success: false, msg: "Lỗi mạng hoặc máy chủ." };
  }

  if (!response.ok) {
    console.log("Failed to update booking fee:", response.statusText);
    return {
      success: false,
      msg: "Không thể cập nhật phí đặt chỗ",
    };
  }

  updateTag("booking-fee");
  return { success: true, msg: "Cập nhật phí đặt chỗ thành công" };
}
