import VehicleModelCreateDialog from "@/features/vehicle-models/components/vehicle-model-create-dialog";
import SectionHeader from "@/components/shared/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/auth-server";
import { CarModelSchema } from "@/features/vehicle-models/schemas/vehicle-model.schema";
import type { CarModel } from "@/features/vehicle-models/schemas/vehicle-model.types";
import { getConnectorTypes } from "../connector-type/page";
import { ConnectorTypeProvider } from "@/contexts/connector-type-context";
import { VehicleModelTable } from "@/features/vehicle-models/components/vehicle-model-table";
import { VehicleModelUpdateProvider } from "@/contexts/vehicle-model-action-context";
import VehicleModelEditDialog from "@/features/vehicle-models/components/vehicle-model-edit-dialog";
import SectionContent from "@/components/shared/section-content";
import { API_BASE_URL } from "@/lib/api-config";

export async function getVehicleModels(token: string): Promise<CarModel[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicle-models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

export default async function VehicleModelsPage() {
  const { token } = await getUser();
  const vehicleModels = await getVehicleModels(token!);
  const connectorTypes = await getConnectorTypes();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <ConnectorTypeProvider connectorTypes={connectorTypes}>
        <SectionHeader
          title={"Quản lý Xe Điện"}
          subtitle={
            "Quản lý và theo dõi các mẫu xe điện và thông số kỹ thuật một cách hiệu quả"
          }
        >
          <VehicleModelCreateDialog />
        </SectionHeader>

        <SectionContent>
          <VehicleModelUpdateProvider>
            <VehicleModelTable data={vehicleModels} />
            <VehicleModelEditDialog />
          </VehicleModelUpdateProvider>
        </SectionContent>
      </ConnectorTypeProvider>
    </div>
  );
}
