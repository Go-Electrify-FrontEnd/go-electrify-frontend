"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { CreateStationSchema } from "@/types/station";

// Server action for creating a station
export async function createStation(formData: FormData) {
  try {
    const useManualCoords = formData.get("useManualCoords") === "true";

    // If user uploaded a file, simulate upload and produce an image URL.
    const file = formData.get("image") as File | null;
    let imageUrl: string | undefined = undefined;
    if (file && file.size > 0) {
      // In production, upload the file to cloud storage and get a URL.
      // For now we simulate by creating an object URL (not persistent) or a placeholder.
      // Note: object URLs won't survive server-side redirects; replace with real upload.
      imageUrl = `https://example.com/uploads/${encodeURIComponent(file.name)}`;
    }

    let latitude: number;
    let longitude: number;
    const address = formData.get("address") as string;

    if (useManualCoords) {
      // User entered coordinates manually
      latitude = parseFloat(formData.get("latitude") as string);
      longitude = parseFloat(formData.get("longitude") as string);
    } else {
      // User entered address - you need to transform it to coordinates
      // TODO: Implement address geocoding here
      console.log("Address to geocode:", address);

      // Example: Call your geocoding service/API
      // const coords = await geocodeAddress(address);
      // latitude = coords.lat;
      // longitude = coords.lng;

      // Placeholder coordinates (replace with actual geocoding)
      latitude = 10.8231;
      longitude = 106.6297;

      console.log(
        "⚠️  Address geocoding not implemented yet. Using default coordinates.",
      );
    }

    const rawData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      address,
      imageUrl,
      latitude,
      longitude,
      status: formData.get("status") as "active" | "inactive" | "maintenance",
    };

    // Validate with Zod
    const validatedData = CreateStationSchema.parse(rawData);

    // TODO: Replace with actual database/API call
    console.log("Creating station:", validatedData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, you would:
    // const station = await db.station.create({ data: validatedData });
    // or
    // const response = await fetch('/api/stations', {
    //   method: 'POST',
    //   body: JSON.stringify(validatedData),
    //   headers: { 'Content-Type': 'application/json' }
    // });

    // Revalidate and redirect (locale-aware)
    revalidatePath("/dashboard/stations");
    const locale = await getLocale();
    redirect({ href: "/dashboard/stations", locale });
  } catch (error) {
    console.error("Station creation failed:", error);
    // In a real app, you might want to return an error response
    // or redirect back with error state
    throw new Error("Failed to create station");
  }
}
