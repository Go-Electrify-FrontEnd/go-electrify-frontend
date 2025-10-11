import { VehicleModelTable } from "@/components/dashboard/admin/vehicle-models/vehicle-model-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/auth-server";
import { CarModel, CarModelSchema } from "@/types/car";
import { Plus, Car } from "lucide-react";

async function getData(token: string): Promise<CarModel[]> {
  try {
    const url = "https://api.go-electrify.com/api/v1/vehicle-models";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.log("Failed to fetch vehicle models, status: " + response.status);
      return [];
    }

    const jsonData = await response.json();
    const vehicleModelsArraySchema = CarModelSchema.array();
    const { success, data } = vehicleModelsArraySchema.safeParse(jsonData);
    if (!success) {
      console.log("Invalid vehicle model data format");
      return [];
    }
    return data;
  } catch (error: unknown) {
    console.log("Error fetching vehicle models: " + JSON.stringify(error));
  }

  return [];
}

export default async function VehicleModelsPage() {
  const { token } = await getUser();
  const vehicleModels = await getData(token!);

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
            <Button size="lg">
              <Plus />
              <span className="font-semibold">Thêm Xe Mới</span>
            </Button>
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
