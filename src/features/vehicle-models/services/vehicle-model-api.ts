import { CarModel, CarModelSchema } from "@/types/car";

export async function getVehicleModels(token: string): Promise<CarModel[]> {
  try {
    const response = await fetch(
      "https://api.go-electrify.com/api/v1/vehicle-models",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60, tags: ["vehicle-models"] },
      },
    );

    if (!response.ok) {
      console.log("Failed to fetch vehicle models, status: " + response.status);
      return [];
    }

    const jsonData = await response.json();
    const parsed = CarModelSchema.array().safeParse(jsonData);

    if (parsed.success) {
      return parsed.data;
    } else {
      console.log("Invalid vehicle model data format");
      return [];
    }
  } catch (error: unknown) {
    console.log("Error fetching vehicle models: " + JSON.stringify(error));
    return [];
  }
}
