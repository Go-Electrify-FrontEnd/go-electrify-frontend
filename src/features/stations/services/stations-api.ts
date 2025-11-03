import { Station, StationApiSchema } from "../schemas/station.schema";
import { API_BASE_URL } from "@/lib/api-config";

export async function getStations(): Promise<Station[]> {
  const url = `${API_BASE_URL}/stations`;
  const response = await fetch(url, {
    method: "GET",
    next: { tags: ["stations"] },
  });

  if (!response.ok) {
    console.error("Failed to fetch stations, status: " + response.status);
    return [];
  }

  const { data, success, error } = StationApiSchema.array().safeParse(
    await response.json(),
  );
  if (!success) {
    console.error("Failed to parse stations:", error);
    return [];
  }

  return data;
}
