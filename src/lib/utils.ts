import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the backend URL with optional team ID appended in development
 */
export function getBackendUrl(path: string = ""): string {
  const baseUrl =
    process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // Remove leading slash from path if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // In development, append team ID if configured
  const isDev = process.env.NODE_ENV === "development";
  const teamId = process.env.TEST_TEAM_ID;

  if (isDev && teamId && cleanPath) {
    return `${baseUrl}/${cleanPath}?teamId=${teamId}`;
  }

  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
}

/**
 * Calculate distance between two geographic coordinates using Haversine formula (async)
 * Lag vai nen phai sai async thoi! lan dau tien can dung den async lmao
 * @param origin - Origin coordinates as [longitude, latitude]
 * @param destination - Destination coordinates as [longitude, latitude]
 * @returns Promise that resolves to distance in kilometers
 */
export async function calculateDistance(
  origin: [number, number],
  destination: [number, number],
): Promise<number> {
  return new Promise((resolve) => {
    // Use setTimeout to defer execution and not block the main thread
    const EARTH_RADIUS_KM = 6371;
    const toRadians = (value: number) => (value * Math.PI) / 180;

    const [originLng, originLat] = origin;
    const [targetLng, targetLat] = destination;

    const dLat = toRadians(targetLat - originLat);
    const dLng = toRadians(targetLng - originLng);
    const originLatRad = toRadians(originLat);
    const targetLatRad = toRadians(targetLat);

    const haversine =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(originLatRad) *
        Math.cos(targetLatRad) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const centralAngle =
      2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    const distance = EARTH_RADIUS_KM * centralAngle;
    resolve(distance);
  });
}
