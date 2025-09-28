import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBackendUrl(path: string) {
  const url = new URL(path, process.env.BACKEND_URL);
  if (process.env.NODE_ENV === "development") {
    url.searchParams.append("teamId", process.env.TEST_TEAM_ID || "");
  }

  console.log("Backend URL: " + url.toString());
  return url.toString();
}
