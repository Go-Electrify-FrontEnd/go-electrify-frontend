import { Station, StationApiSchema } from "../schemas/station.schema";

export async function getStations(): Promise<Station[]> {
  const url = "https://api.go-electrify.com/api/v1/stations";
  const response = await fetch(url, {
    method: "GET",
    next: { revalidate: 15, tags: ["stations"] },
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
