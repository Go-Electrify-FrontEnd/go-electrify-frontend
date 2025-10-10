"use server";

import { getUser } from "@/lib/auth/auth-server";
import { revalidateTag } from "next/cache";
import { forbidden } from "next/navigation";

export async function handleCreateConnectorType(prev: any, data: FormData) {
  const { user, token } = await getUser();

  if (!user) {
    console.log("User not authenticated");
    forbidden();
  }

  if (!token) {
    console.log("No access token found");
    forbidden();
  }

  const name = data.get("name")?.toString();
  const description = data.get("description")?.toString();
  const maxPowerKw = data.get("maxPowerKw")?.toString();

  if (!name) {
    return { success: false, msg: "Tên cổng kết nối là bắt buộc" };
  }

  if (!maxPowerKw || isNaN(Number(maxPowerKw))) {
    return { success: false, msg: "Công suất phải là số" };
  }

  if (Number(maxPowerKw) <= 0) {
    return { success: false, msg: "Công suất phải lớn hơn 0" };
  }

  if (Number(maxPowerKw) > 1000) {
    return { success: false, msg: "Công suất vượt quá giới hạn cho phép" };
  }

  const url = "https://api.go-electrify.com/api/v1/connector-types";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      Name: name,
      Description: description,
      MaxPowerKw: Number(maxPowerKw),
    }),
  });

  if (!response.ok) {
    return {
      success: false,
      msg: "Không thể tạo loại cổng kết nối",
    };
  }

  revalidateTag("connector-types");
  return { success: true, msg: "Tạo loại cổng kết nối thành công" };
}
