// app/api/notifications/route.ts
// MOST SECURE VERSION - API Route as Proxy
import { NextResponse } from "next/server";
import { getUserSafe } from "@/lib/auth/auth-wrapper"; // Use safe wrapper

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Verify user authentication
    const { user } = await getUserSafe();
    if (!user) {
      console.error("❌ Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ User authenticated:", user.uid || user.email);

    // 2. Call external API
    // URL và credentials được giữ bí mật ở server
    const externalApiUrl =
      process.env.EXTERNAL_API_URL ||
      "https://api.go-electrify.com/api/v1/notifications";

    console.log("🌐 Calling external API...");

    const response = await fetch(externalApiUrl, {
      method: "GET",
      headers: {
        accept: "*/*",
        // Có thể thêm secret tokens ở đây mà client không biết
        // "X-API-Key": process.env.EXTERNAL_API_KEY,
        // "Authorization": `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
      },
      cache: "no-store",
    });

    console.log("📡 External API response:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ External API error:", errorText);

      // Don't expose internal error details to client
      return NextResponse.json(
        { error: "Unable to fetch notifications" },
        { status: 500 },
      );
    }

    const data = await response.json();
    console.log(
      "✅ Data received:",
      Array.isArray(data) ? `${data.length} items` : "invalid format",
    );

    // 3. Optional: Transform/filter data based on user
    // const userNotifications = data.filter(n => n.userId === user.id);

    // 4. Return data with security headers
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, no-store, must-revalidate", // private = only for this user
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  } catch (error) {
    console.error("❌ Server error:", error);

    // Don't expose internal error details to client
    return NextResponse.json(
      { error: "An error occurred while fetching notifications" },
      { status: 500 },
    );
  }
}
