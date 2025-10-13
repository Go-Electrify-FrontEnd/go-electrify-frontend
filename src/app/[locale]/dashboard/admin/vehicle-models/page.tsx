import VehicleModelCreateDialog from "@/components/dashboard/admin/vehicle-models/vehicle-model-create-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/auth-server";
import { CarModel, CarModelSchema } from "@/types/car";
import { Car } from "lucide-react";
import { getConnectorTypes } from "../connector-type/page";
import { ConnectorTypeProvider } from "@/contexts/connector-type-context";
import { setRequestLocale } from "next-intl/server";
import { VehicleModelTable } from "@/components/dashboard/admin/vehicle-models/vehicle-model-table";
import { VehicleModelUpdateProvider } from "@/contexts/vehicle-model-action-context";
import VehicleModelEditDialog from "@/components/dashboard/admin/vehicle-models/vehicle-model-edit-dialog";

async function getVehicleModels(token: string): Promise<CarModel[]> {
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await fetch(
      "https://api.go-electrify.com/api/v1/vehicle-models",
      {
        method: "GET",
        headers,
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

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function VehicleModelsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as "en" | "vi");

  const { token } = await getUser();
  const vehicleModels = await getVehicleModels(token!);
  const connectorTypes = await getConnectorTypes();

  return (
    <ConnectorTypeProvider connectorTypes={connectorTypes}>
      <div className="flex flex-col gap-4 py-4 md:gap-6">
        {/* Header (plain text, not a card) */}
        <div className="pb-4">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                <div className="space-y-1.5">
                  <h1 className="text-foreground text-4xl font-semibold">
                    Quản lý Xe Điện
                  </h1>
                  <p className="text-muted-foreground/90 text-base font-medium">
                    Quản lý và theo dõi các mẫu xe điện và thông số kỹ thuật một
                    cách hiệu quả
                  </p>
                </div>
              </div>
            </div>
            <VehicleModelCreateDialog />
          </div>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Danh sách xe điện</CardTitle>
            <CardDescription>
              Tất cả các mẫu xe điện trong hệ thống với thông tin chi tiết
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VehicleModelUpdateProvider>
              <VehicleModelTable data={vehicleModels} />
              <VehicleModelEditDialog />
            </VehicleModelUpdateProvider>
          </CardContent>
        </Card>
      </div>
    </ConnectorTypeProvider>
  );
}
