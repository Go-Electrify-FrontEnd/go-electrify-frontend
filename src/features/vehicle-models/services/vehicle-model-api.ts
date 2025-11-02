import { CarModel, CarModelSchema } from "@/types/car";
import { API_BASE_URL } from "@/lib/api-config";

export async function getVehicleModels(token: string): Promise<CarModel[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/vehicle-models`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
