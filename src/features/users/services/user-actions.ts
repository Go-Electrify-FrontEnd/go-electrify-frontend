"use server";

import { getUser, refreshAccessToken } from "@/lib/auth/auth-server";
import { API_BASE_URL } from "@/lib/api-config";
import { forbidden } from "next/navigation";

export async function updateUserName(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();

  if (!user || !token) {
    forbidden();
  }
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim().length < 3) {
    return { success: false, msg: "Tên không hợp lệ (3-50 ký tự)" };
  }

  const url = `${API_BASE_URL}/profile/name`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ FullName: name }),
  });

  if (!response.ok) {
    return { success: false, msg: "Không thể cập nhật tên người dùng" };
  }

  await refreshAccessToken();
  return { success: true, msg: "Cập nhật tên người dùng thành công" };
}
