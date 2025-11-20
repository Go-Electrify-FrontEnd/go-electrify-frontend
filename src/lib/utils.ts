import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import distance from "@turf/distance";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  return distance(origin, destination, { units: "kilometers" });
}
