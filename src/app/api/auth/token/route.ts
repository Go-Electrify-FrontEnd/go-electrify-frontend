// src/app/api/auth/token/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth-token")?.value;

  return NextResponse.json({ token: token ?? null });
}
