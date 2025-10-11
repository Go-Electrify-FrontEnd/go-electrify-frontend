"use server";

import { getUser } from "@/lib/auth/auth-server";
import { revalidateTag } from "next/cache";
import { forbidden } from "next/navigation";
import { z } from "zod";

const connectorTypeCreateSchema = z.object({
  name: z.string().trim().min(1, "Tên cổng kết nối là bắt buộc"),
  description: z
    .string()
    .trim()
    .max(200, "Mô tả tối đa 200 ký tự")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  maxPowerKw: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v), { message: "Công suất phải là số" })
    .min(1, "Công suất phải lớn hơn 0")
    .max(1000, "Công suất vượt quá giới hạn cho phép"),
});

const connectorTypeUpdateSchema = connectorTypeCreateSchema.extend({
  id: z.string().trim().min(1, "ID cổng kết nối là bắt buộc"),
});

export async function handleCreateConnectorType(
  prev: unknown,
  formData: FormData,
) {
  const { user, token } = await getUser();

  if (!user || !token) {
    console.log("User not authenticated");
    forbidden();
  }

  const { success, data, error } = connectorTypeCreateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    maxPowerKw: formData.get("maxPowerKw"),
  });

  if (!success) {
    const msg = error.issues.map((issue) => issue.message).join("; ");
    return { success: false, msg };
  }

  const url = "https://api.go-electrify.com/api/v1/connector-types";
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

  revalidateTag("connector-types");
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
    id: formData.get("id"),
  });

  if (!success) {
    const msg = error.issues.map((issue) => issue.message).join("; ");
    return { success: false, msg };
  }

  const url = `https://api.go-electrify.com/api/v1/connector-types/${data.id}`;
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

  revalidateTag("connector-types");
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
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    maxPowerKw: formData.get("maxPowerKw"),
  });

  if (!success) {
    const msg = error.issues.map((issue) => issue.message).join("; ");
    return { success: false, msg };
  }

  const url = `https://api.go-electrify.com/api/v1/connector-types/${data.id}`;
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

  revalidateTag("connector-types");
  return { success: true, msg: "Cập nhật loại cổng kết nối thành công" };
}
