import { getUser } from "@/lib/auth/auth-server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-config";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname: string,
        clientPayload: string | null,
        multipart: boolean,
      ) => {
        // Authenticate the user and include the stationId from the client payload
        const { user, token } = await getUser();
        if (!user) {
          throw new Error("Unauthorized");
        }

        let stationId: string | undefined;
        if (clientPayload) {
          try {
            const parsed = JSON.parse(clientPayload || "{}");
            stationId = parsed?.stationId;
          } catch {
            // ignore parse errors
          }
        }

        if (!stationId) {
          throw new Error("Missing stationId in client payload");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
          ],
          tokenPayload: JSON.stringify({ stationId, token }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Update station image in backend once upload completes
        // Note: this webhook will not function on localhost; use a tunnel for end-to-end testing.
        try {
          const { stationId, token } = JSON.parse(tokenPayload || "{}");
          if (!stationId) {
            throw new Error("Could not find stationId in tokenPayload");
          }

          const url = `${API_BASE_URL}/stations/${encodeURIComponent(
            stationId,
          )}`;

          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ImageUrl: blob.url }),
          });

          if (!response.ok) {
            throw new Error("Could not update station, status: " + response.status);
          } else {
            console.log(`Station ${stationId} updated with new image: ${blob.url}`);
          }
        } catch (err) {
          console.error("onUploadCompleted (stations) error", err);
          throw new Error("Could not update station");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}
