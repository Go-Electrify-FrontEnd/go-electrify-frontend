import { ChargerAPI } from "@/lib/zod/charger/charger.request";
import { Charger } from "@/lib/zod/charger/charger.schema";
import {
  StationSession,
  StationSessionSchema,
} from "@/lib/zod/session/session.schema";

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
