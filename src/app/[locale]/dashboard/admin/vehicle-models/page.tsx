import VehicleModelCreateDialog from "@/components/dashboard/admin/vehicle-models/vehicle-model-create-dialog";
import { VehicleModelTable } from "@/components/dashboard/admin/vehicle-models/vehicle-model-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/auth-server";
import { CarModel, CarModelSchema } from "@/types/car";
import { ConnectorType, ConnectorTypeSchema } from "@/types/connector";
import { Car } from "lucide-react";

type VehicleModelData = {
  vehicleModels: CarModel[];
  connectorTypes: ConnectorType[];
};

async function getData(token: string): Promise<VehicleModelData> {
  const headers = { Authorization: `Bearer ${token}` };
  const requestConfig = { headers, next: { revalidate: 60 } };

  try {
    const [vehicleModelsResponse, connectorTypesResponse] = await Promise.all([
      fetch("https://api.go-electrify.com/api/v1/vehicle-models", {
        ...requestConfig,
        method: "GET",
      }),
      fetch(
        "https://api.go-electrify.com/api/v1/connector-types",
        requestConfig,
      ),
    ]);

    let vehicleModels: CarModel[] = [];
    if (vehicleModelsResponse.ok) {
      const jsonData = await vehicleModelsResponse.json();
      const vehicleModelsArraySchema = CarModelSchema.array();
      const parsedVehicleModels = vehicleModelsArraySchema.safeParse(jsonData);
      if (parsedVehicleModels.success) {
        vehicleModels = parsedVehicleModels.data;
      } else {
        console.log("Invalid vehicle model data format");
      }
    } else {
      console.log(
        "Failed to fetch vehicle models, status: " +
          vehicleModelsResponse.status,
      );
    }

    let connectorTypes: ConnectorType[] = [];
    if (connectorTypesResponse.ok) {
      const connectorJson = await connectorTypesResponse.json();
      const connectorTypeArraySchema = ConnectorTypeSchema.array();
      const parsedConnectorTypes =
        connectorTypeArraySchema.safeParse(connectorJson);
      if (parsedConnectorTypes.success) {
        connectorTypes = parsedConnectorTypes.data;
      } else {
        console.log("Invalid connector type data format");
      }
    } else {
      console.log(
        "Failed to fetch connector types, status: " +
          connectorTypesResponse.status,
      );
    }

    return { vehicleModels, connectorTypes };
  } catch (error: unknown) {
    console.log(
      "Error fetching vehicle models or connector types: " +
        JSON.stringify(error),
    );
    return { vehicleModels: [], connectorTypes: [] };
  }
}

export default async function VehicleModelsPage() {
  const { token } = await getUser();
  const { vehicleModels, connectorTypes } = await getData(token!);
  return (
    <div className="container mx-auto mt-4 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="relative pt-8 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                <div className="bg-primary ring-primary/10 relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl ring-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <Car className="text-primary-foreground h-8 w-8 drop-shadow-lg" />
                </div>
                <div className="space-y-1.5">
                  <CardTitle className="text-foreground text-4xl font-semibold">
                    Quản lý Xe Điện
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/90 text-base font-medium">
                    Quản lý và theo dõi các mẫu xe điện và thông số kỹ thuật một
                    cách hiệu quả
                  </CardDescription>
                </div>
              </div>
            </div>
            <VehicleModelCreateDialog connectorTypes={connectorTypes} />
          </div>
        </CardHeader>
      </Card>

      {/* Data Table Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Danh sách xe điện</CardTitle>
          <CardDescription>
            Tất cả các mẫu xe điện trong hệ thống với thông tin chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleModelTable data={vehicleModels} />
        </CardContent>
      </Card>
    </div>
  );
}
