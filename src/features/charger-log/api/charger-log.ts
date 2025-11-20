import "server-only";
import { API_BASE_URL } from "@/lib/api-config";
import { getUser } from "@/lib/auth/auth-server";
import { ChargerLogResponseSchema } from "../schemas/charger-log.schema";

export async function getChargerLogs(
  chargerId: number,
  page: number = 1,
  pageSize: number = 50,
  order: "asc" | "desc" = "desc",
) {
  const { token } = await getUser();
  const url = `${API_BASE_URL}/chargers/${chargerId}/logs?page=${page}&pageSize=${pageSize}&order=${order}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.error("Failed to fetch charger logs, status: " + response.status);
    return {
      success: false,
      length: 0,
      data: { page: 1, pageSize, total: 0, items: [] },
    };
  }

  const { success, data, error } = ChargerLogResponseSchema.safeParse(
    await response.json(),
  );

  if (!success) {
    console.error("Failed to parse charger logs:", JSON.stringify(error));
    return {
      success: false,
      length: 0,
      data: { page: 1, pageSize, total: 0, items: [] },
    };
  }

  return {
    success: true,
    length: data.data.items.length,
    data: data.data,
  };
}
