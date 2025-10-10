import { CarModelsTable } from "@/components/dashboard/admin/car-models/car-model-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CarModel } from "@/types/car";
import { Plus, Car } from "lucide-react";

async function getData(): Promise<CarModel[]> {
  // Mock data - replace with actual API call
  return [];
}

export default async function CarModelsPage() {
  const carModels = await getData();

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
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="group/btn bg-primary shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 relative w-full overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto"
              >
                <Plus className="relative mr-2 h-5 w-5 transition-transform duration-300 group-hover/btn:rotate-90" />
                <span className="relative font-semibold">Thêm Xe Mới</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Data Table Card */}
      <Card className="overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Danh sách xe điện</CardTitle>
          <CardDescription>
            Tất cả các mẫu xe điện trong hệ thống với thông tin chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CarModelsTable data={carModels} />
        </CardContent>
      </Card>
    </div>
  );
}
