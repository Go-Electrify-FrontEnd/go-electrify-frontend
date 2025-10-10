import "server-only";

import { cookies } from "next/headers";
import { User } from "@/types/user";
import * as jose from "jose";

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken");

    if (!accessTokenCookie || !accessTokenCookie.value) {
      return { user: null };
    }

    const secret = new TextEncoder().encode(process.env.AUTH_SECRET_KEY);
    let user: User | null = null;

    if (accessTokenCookie.value) {
      try {
        const { payload } = await jose.jwtVerify<User>(
          accessTokenCookie.value,
          secret,
          {
            clockTolerance: "5s",
          },
        );

        if (payload) {
          user = {
            uid: payload.uid,
            email: payload.email,
            role: payload.role,
            name: payload.name,
            avatar: payload.avatar,
          };
        }
      } catch (jwtError) {
        console.error("JWT verification failed:", jwtError);
        return { user: null };
      }
    }

    return { user };
  } catch (error) {
    console.error("Error in getUser:", error);
    return { user: null };
  }
}

// export async function refreshAccessToken(): Promise<{
//   accessToken: string;
//   refreshToken: string;
// } | null> {
//   try {
//     const cookieStore = await cookies();
//     const refreshTokenCookie = cookieStore.get("refreshToken");

//     if (!refreshTokenCookie || !refreshTokenCookie.value) {
//       return null;
//     }

//     // Call the refresh token API endpoint
//     const url = "https://api.go-electrify.com/api/v1/auth/refreshToken";
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${refreshTokenCookie.value}`,
//       },
//       body: JSON.stringify({
//         refreshToken: refreshTokenCookie.value,
//       }),
//     });

//     if (!response.ok) {
//       console.error("Failed to refresh token:", response.status);
//       return null;
//     }

//     const data: RefreshApiResponse = await response.json();

//     if (data.AccessToken && data.RefreshToken) {
//       return {
//         accessToken: data.AccessToken,
//         refreshToken: data.RefreshToken,
//       };
//     }

//     return null;
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return null;
//   }
// }
