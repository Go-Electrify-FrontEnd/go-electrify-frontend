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
 * Calculate distance between two geographic coordinates using Turf.js
 * Uses the Haversine formula for accurate distance calculation
 * @param origin - Origin coordinates as [longitude, latitude]
 * @param destination - Destination coordinates as [longitude, latitude]
 * @returns Distance in kilometers
 */
export function calculateDistance(
  origin: [number, number],
  destination: [number, number],
): number {
  // Lazy import turf/distance to reduce initial bundle size
  // This is synchronous and more efficient than the previous async wrapper
  const distance = require("@turf/distance").default;
  return distance(origin, destination, { units: "kilometers" });
}
