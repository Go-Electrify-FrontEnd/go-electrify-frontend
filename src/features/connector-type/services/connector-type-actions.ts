"use server";

import { getUser } from "@/lib/auth/auth-server";
import { updateTag } from "next/cache";
import { forbidden } from "next/navigation";
import { z } from "zod";
import {
  connectorTypeCreateSchema,
  connectorTypeUpdateSchema,
} from "../schemas/connector-type.request";
import { API_BASE_URL } from "@/lib/api-config";

export async function handleCreateConnectorType(
  prev: unknown,
  formData: FormData,
) {
  const { user, token } = await getUser();

  if (!user || !token) {
    forbidden();
  }

  const { success, data, error } = connectorTypeCreateSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    maxPowerKw: String(formData.get("maxPowerKw") ?? ""),
  });

  if (!success) {
    const msg = error.issues.map((issue) => issue.message).join("; ");
    return { success: false, msg };
  }

  const url = `${API_BASE_URL}/connector-types`;
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Name: data.name,
        Description: data.description,
        MaxPowerKw: data.maxPowerKw,
      }),
    });
  } catch (err: unknown) {
    console.error(err);
    return { success: false, msg: "Lỗi mạng hoặc máy chủ." };
  }

  if (!response.ok) {
    return {
      success: false,
      msg: "Không thể tạo loại cổng kết nối",
    };
  }

  updateTag("connector-types");
  return { success: true, msg: "Tạo loại cổng kết nối thành công" };
}

const deleteSchema = z.object({
  id: z.string().trim().min(1, "ID cổng kết nối là bắt buộc"),
});

export async function handleDeleteConnectorType(
  prev: unknown,
  formData: FormData,
) {
  const { user, token } = await getUser();

  if (!user || !token) {
    console.log("User not authenticated");
    forbidden();
  }

  const { success, data, error } = deleteSchema.safeParse({
    id: String(formData.get("id") ?? ""),
  });

  if (!success) {
    const msg = error.issues.map((issue) => issue.message).join("; ");
    return { success: false, msg };
  }

  const url = `${API_BASE_URL}/connector-types/${data.id}`;
  let response;
  try {
    response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err: unknown) {
    console.error(err);
    return { success: false, msg: "Lỗi mạng hoặc máy chủ." };
  }

  if (!response.ok) {
    return {
      success: false,
      msg: "Không thể xóa loại cổng kết nối",
    };
  }

  updateTag("connector-types");
  return { success: true, msg: "Xóa loại cổng kết nối thành công" };
}

export async function handleUpdateConnectorType(
  prev: unknown,
  formData: FormData,
) {
  const { user, token } = await getUser();

  if (!user || !token) {
    console.log("User not authenticated");
    forbidden();
  }

  const { success, data, error } = connectorTypeUpdateSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    maxPowerKw: String(formData.get("maxPowerKw") ?? ""),
  });

  if (!success) {
    const msg = error.issues.map((issue) => issue.message).join("; ");
    return { success: false, msg };
  }

  const url = `${API_BASE_URL}/connector-types/${data.id}`;
  let response;
  try {
    response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Name: data.name,
        Description: data.description,
        MaxPowerKw: data.maxPowerKw,
      }),
    });
  } catch (err: unknown) {
    console.error(err);
    return { success: false, msg: "Lỗi mạng hoặc máy chủ." };
  }

  if (!response.ok) {
    return {
      success: false,
      msg: "Không thể cập nhật loại cổng kết nối",
    };
  }

  updateTag("connector-types");
  return { success: true, msg: "Cập nhật loại cổng kết nối thành công" };
}
