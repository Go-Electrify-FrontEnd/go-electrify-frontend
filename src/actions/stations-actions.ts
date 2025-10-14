"use server";

import { revalidateTag } from "next/cache";
import { getUser } from "@/lib/auth/auth-server";
import { stationCreateSchema, stationUpdateSchema } from "@/schemas/station.schema";

const BASE_URL = "https://api.go-electrify.com/api/v1/stations";

export async function createStation(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    return { success: false, msg: "Người dùng chưa xác thực" };
  }

  const { success, data, error } = stationCreateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    address: formData.get("address"),
    imageUrl: formData.get("imageUrl"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    status: formData.get("status"),
  });

  if (!success) {
    console.error("Validation error:", error);
    return { success: false, msg: "Dữ liệu không hợp lệ" };
  }

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Name: data.name,
        Description: data.description,
        Address: data.address,
        ImageUrl: data.imageUrl,
        Latitude: data.latitude ? Number(data.latitude) : undefined,
        Longitude: data.longitude ? Number(data.longitude) : undefined,
        Status: "ACTIVE",
      }),
    });

    if (response.ok) {
      revalidateTag("stations");
      return { success: true, msg: "Trạm đã được tạo thành công" };
    } else {
      return { success: false, msg: "Tạo trạm thất bại" };
    }
  } catch (error) {
    console.error("Error creating station:", error);
    return { success: false, msg: "Đã xảy ra lỗi khi tạo trạm" };
  }
}

export async function updateStation(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    return { success: false, msg: "Người dùng chưa xác thực" };
  }

  const id = formData.get("id")?.toString();
  if (!id) {
    return { success: false, msg: "Vui lòng cung cấp id trạm" };
  }

  const { success, data, error } = stationUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    address: formData.get("address"),
    imageUrl: formData.get("imageUrl"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    status: formData.get("status"),
  });

  if (!success) {
    console.error("Validation error:", error);
    return { success: false, msg: "Dữ liệu không hợp lệ" };
  }

  try {
    const url = `${BASE_URL}/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Name: data.name,
        Description: data.description,
        Address: data.address,
        ImageUrl: data.imageUrl,
        Latitude: data.latitude ? Number(data.latitude) : undefined,
        Longitude: data.longitude ? Number(data.longitude) : undefined,
        Status: data.status.toUpperCase(),
      }),
    });

    if (response.ok) {
      revalidateTag("stations");
      return { success: true, msg: "Trạm đã được cập nhật thành công" };
    } else {
      return { success: false, msg: "Cập nhật trạm thất bại" };
    }
  } catch (error) {
    console.error("Error updating station:", error);
    return { success: false, msg: "Đã xảy ra lỗi khi cập nhật trạm" };
  }
}

export async function deleteStation(prev: unknown, formData: FormData) {
  const { user, token } = await getUser();
  if (!user || !token) {
    return { success: false, msg: "Người dùng chưa xác thực" };
  }

  const id = formData.get("id");
  if (!id || Array.isArray(id)) {
    return { success: false, msg: "ID trạm không hợp lệ" };
  }

  try {
    const url = `${BASE_URL}/${encodeURIComponent(id as string)}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      revalidateTag("stations");
      return { success: true, msg: "Trạm đã được xóa thành công" };
    } else {
      return { success: false, msg: "Xóa trạm thất bại" };
    }
  } catch (error) {
    console.error("Error deleting station:", error);
    return { success: false, msg: "Đã xảy ra lỗi khi xóa trạm" };
  }
}
