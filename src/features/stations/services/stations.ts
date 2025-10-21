"use server";

import { revalidateTag } from "next/cache";
import { getUser } from "@/lib/auth/auth-server";
import {
  stationCreateSchema,
  stationUpdateSchema,
} from "@/lib/zod/station/station.request";
import { ChargerApiSchema } from "@/lib/zod/charger/charger.schema";
import type { Charger } from "@/lib/zod/charger/charger.types";
import { StationSessionApiSchema } from "@/lib/zod/session/session.schema";
import type { StationSession } from "@/lib/zod/session/session.types";

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
        Status: data.status ? String(data.status).toUpperCase() : "ACTIVE",
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
        Status: data.status ? String(data.status).toUpperCase() : undefined,
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

export async function getStationChargers(
  stationId: string,
  token: string,
): Promise<Charger[]> {
  if (!token) {
    console.error("getStationChargers: missing auth token");
    return [];
  }

  try {
    const url = `https://api.go-electrify.com/api/v1/stations/${encodeURIComponent(
      stationId,
    )}/chargers`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60, tags: ["chargers"] },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch station chargers, status:",
        response.status,
      );
      return [];
    }

    const json = await response.json();
    const raw = Array.isArray(json?.data) ? json.data : json;
    const parsed = ChargerApiSchema.array().safeParse(raw);
    if (!parsed.success) {
      console.error("Invalid charger items:", parsed.error);
      return [];
    }

    return parsed.data;
  } catch (error) {
    console.error("Error fetching station chargers:", error);
    return [];
  }
}

export async function getStationSessions(
  stationId: string,
  token: string,
): Promise<StationSession[]> {
  if (!token) {
    console.error("getStationSessions: missing auth token");
    return [];
  }

  try {
    const url = `https://api.go-electrify.com/api/v1/stations/${encodeURIComponent(
      stationId,
    )}/sessions`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60, tags: ["station-sessions"] },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch station sessions, status:",
        response.status,
      );
      return [];
    }

    const json = await response.json();
    const raw = Array.isArray(json?.data) ? json.data : json;
    const parsed = StationSessionApiSchema.array().safeParse(raw);
    if (!parsed.success) {
      console.error("Invalid session items:", parsed.error);
      return [];
    }

    return parsed.data;
  } catch (error) {
    console.error("Error fetching station sessions:", error);
    return [];
  }
}
