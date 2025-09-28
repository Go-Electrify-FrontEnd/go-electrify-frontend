import "server-only";

import { cookies } from "next/headers";
import { getBackendUrl } from "./utils";

export async function getUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    return null;
  }

  const url = getBackendUrl("me");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}
