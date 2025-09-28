import { columns } from "@/components/dashboard/admin/car-models/columns";
import { SharedDataTable } from "@/components/ui/shared-data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Car } from "lucide-react";

export interface CarModel {
  id: number;
  modelName: string;
  maxPowerKw: number;
  batteryCapacityKwh: number;
  createdAt: Date;
  updatedAt: Date;
}

async function getData(): Promise<CarModel[]> {
  // Mock data - replace with actual API call
  return [
    {
      id: 1,
      modelName: "Tesla Model 3",
      maxPowerKw: 480,
      batteryCapacityKwh: 75,
      createdAt: new Date("2023-10-01"),
      updatedAt: new Date("2023-10-01"),
    },
    {
      id: 2,
      modelName: "BMW iX3",
      maxPowerKw: 210,
      batteryCapacityKwh: 74,
      createdAt: new Date("2023-10-02"),
      updatedAt: new Date("2023-10-02"),
    },
    {
      id: 3,
      modelName: "Audi e-tron GT",
      maxPowerKw: 350,
      batteryCapacityKwh: 85,
      createdAt: new Date("2023-10-03"),
      updatedAt: new Date("2023-10-03"),
    },
  ];
}

export default async function CarModelsPage() {
  const carModels = await getData();

  return (
    <div className="container mx-auto mt-4 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pt-2 pb-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-3xl">Quản lý Xe Điện</CardTitle>
                  <CardDescription className="text-base">
                    Quản lý các mẫu xe điện và thông số kỹ thuật của chúng
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Thêm Xe Mới
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Data Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Danh sách xe điện</CardTitle>
              <CardDescription>
                Tất cả các mẫu xe điện trong hệ thống
              </CardDescription>
            </div>
            <div className="bg-muted rounded-full px-3 py-1.5">
              <span className="text-sm font-medium">{carModels.length}</span>
              <span className="text-muted-foreground ml-1 text-xs">mẫu xe</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SharedDataTable
            columns={columns}
            data={carModels}
            searchColumn="modelName"
            searchPlaceholder="Tìm kiếm mẫu xe..."
            emptyMessage="Không có mẫu xe nào."
          />
        </CardContent>
      </Card>
    </div>
  );
}
