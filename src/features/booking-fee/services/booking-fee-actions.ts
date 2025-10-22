"use server";

import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";
import { bookingFeeUpdateSchema } from "@/lib/zod/booking-fee/booking-fee.request";
import { updateTag } from "next/cache";

const BACKEND_URL = "https://api.go-electrify.com/api/v1/admin/booking-fee";

export async function updateBookingFee(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();

  if (!user || !user.role.toLowerCase().includes("admin")) {
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
    return {
      success: false,
      msg: "Không thể cập nhật phí đặt chỗ",
    };
  }

  updateTag("booking-fee");
  return { success: true, msg: "Cập nhật phí đặt chỗ thành công" };
}
