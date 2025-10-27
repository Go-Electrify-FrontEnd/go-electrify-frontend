// src/lib/auth/auth-client.ts
import { useRouter } from "next/navigation";

export async function getClientToken(): Promise<string | null> {
  const res = await fetch("/api/auth/token", { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.token ?? null;
}
