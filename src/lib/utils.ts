import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBackendUrl(path: string) {
  const url = new URL(path, process.env.BACKEND_URL);
  // Add teamId for development or when TEST_TEAM_ID is explicitly set
  if (process.env.NODE_ENV === "development" || process.env.TEST_TEAM_ID) {
    url.searchParams.append("teamId", process.env.TEST_TEAM_ID || "");
  }

  // backend URL computed
  return url.toString();
}
