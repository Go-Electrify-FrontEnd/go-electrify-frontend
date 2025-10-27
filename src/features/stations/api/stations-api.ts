import { ChargerAPI } from "@/lib/zod/charger/charger.request";
import { Charger } from "@/lib/zod/charger/charger.schema";
import {
  StationSession,
  StationSessionSchema,
} from "@/lib/zod/session/session.schema";
import {
  StationStaffListSchema,
  StationStaffSchema,
} from "@/lib/zod/station/station-staff.schema";
import {
  StationApiSchema,
  StationBookingListApiSchema,
  type StationBooking,
} from "@/lib/zod/station/station.schema";

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

    const { data, success, error } = ChargerAPI.safeParse(
      await response.json(),
    );

    if (!success) {
      console.error("Invalid charger items:", error);
      return [];
    }

    const chargers = data.data;
    return chargers;
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
    return [];
  }

  try {
    const url = `https://api.go-electrify.com/api/v1/stations/${encodeURIComponent(
      stationId,
    )}/sessions`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 15, tags: ["station-sessions"] },
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
    const parsed = StationSessionSchema.array().safeParse(raw);
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

export async function getStationById(id: string, token: string) {
  if (!token) {
    console.error("getStationById: missing auth token");
    return null;
  }

  try {
    const url = `https://api.go-electrify.com/api/v1/stations/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch station, status:", response.status);
      return null;
    }

    const { success, data } = StationApiSchema.safeParse(await response.json());

    if (!success) {
      console.error("Failed to parse station data");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching station:", error);
    return null;
  }
}

export async function getBookingsByStationId(
  stationId: string,
  token: string,
): Promise<StationBooking[]> {
  if (!token) {
    console.error("getBookingsByStationId: missing auth token");
    return [];
  }

  try {
    const url = `https://api.go-electrify.com/api/v1/stations/${encodeURIComponent(
      stationId,
    )}/bookings`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch bookings, status:", response.status);
      return [];
    }

    const payload = await response.json();
    const { success, data } = StationBookingListApiSchema.safeParse(payload);

    if (!success) {
      console.error("Failed to parse bookings data");
      return [];
    }

    return data?.data ?? [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function getStationStaff(stationId: string, token: string) {
  if (!token) {
    console.error("getStationStaff: missing auth token");
    return [];
  }

  try {
    const url = `https://api.go-electrify.com/api/v1/stations/${encodeURIComponent(
      stationId,
    )}/staff`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch station staff, status:", response.status);
      return [];
    }

    const payload = await response.json();
    const { success, data } = StationStaffListSchema.safeParse(payload);

    if (!success) {
      console.error("Failed to parse station staff data");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching station staff:", error);
    return [];
  }
}

export async function getSelfStationId(token: string) {
  if (!token) {
    console.error("getSelfStationId: missing auth token");
    return null;
  }

  try {
    const url = `https://api.go-electrify.com/api/v1/stations/me`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch self station, status:", response.status);
      return null;
    }

    const data = await response.json();

    return (data.Id as number) || null;
  } catch (error) {
    console.error("Error fetching self station:", error);
    return null;
  }
}
// Thêm vào cuối file stations-api.ts

/** Tìm kiếm người dùng theo email (chỉ admin) */
export async function searchUsersByEmail(email: string, token: string) {
  if (!token) return [];

  try {
    const url = `https://api.go-electrify.com/api/v1/users/search?email=${encodeURIComponent(email)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return [];

    const json = await response.json();
    // Giả sử API trả về: { data: [{ id, email, fullName, role }] }
    return json.data || [];
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
}

/** Phân công nhân viên vào trạm */
export async function assignStaffToStation(
  stationId: string,
  userId: string,
  token: string,
) {
  if (!token) throw new Error("Missing token");

  const url = `https://api.go-electrify.com/api/v1/stations/${encodeURIComponent(stationId)}/staff`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to assign staff");
  }

  return await response.json();
}

/** Thu hồi quyền nhân viên khỏi trạm */
export async function revokeStaffFromStation(
  stationId: string,
  userId: string,
  token: string,
) {
  if (!token) throw new Error("Missing token");

  const url = `https://api.go-electrify.com/api/v1/stations/${encodeURIComponent(stationId)}/staff/${userId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to revoke staff");
  }

  return true;
}
// Thêm vào cuối file (hoặc thay thế phần cũ nếu có)
export async function searchStaffByEmail(email: string, token: string) {
  if (!token) return [];

  try {
    const url = `https://api.go-electrify.com/api/v1/staff/search?email=${encodeURIComponent(email)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60, tags: ["staff-search"] },
    });

    if (!response.ok) return [];

    const json = await response.json();
    return json.data ?? [];
  } catch (error) {
    console.error("Error searching staff:", error);
    return [];
  }
}
