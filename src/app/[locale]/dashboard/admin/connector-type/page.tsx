import { ConnectorTypesTable } from "@/components/dashboard/admin/connector-type/connector-type-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectorType } from "@/types/connector";
import { Plus, Plug } from "lucide-react";

async function getData(): Promise<ConnectorType[]> {
  return [
    {
      id: 1,
      name: "Type 1 (J1772)",
      description: "Connector tiêu chuẩn cho xe điện AC tại Bắc Mỹ và Nhật Bản",
      maxPowerKw: 22,
      createdAt: new Date("2023-10-01"),
      updatedAt: new Date("2023-10-01"),
    },
    {
      id: 2,
      name: "Type 2 (Mennekes)",
      description: "Connector tiêu chuẩn cho xe điện AC tại châu Âu",
      maxPowerKw: 43,
      createdAt: new Date("2023-10-02"),
      updatedAt: new Date("2023-10-02"),
    },
    {
      id: 3,
      name: "CCS Combo 1",
      description: "Connector DC tốc độ cao cho thị trường Bắc Mỹ",
      maxPowerKw: 350,
      createdAt: new Date("2023-10-03"),
      updatedAt: new Date("2023-10-03"),
    },
    {
      id: 4,
      name: "CCS Combo 2",
      description: "Connector DC tốc độ cao cho thị trường châu Âu",
      maxPowerKw: 350,
      createdAt: new Date("2023-10-04"),
      updatedAt: new Date("2023-10-04"),
    },
  ];
}

export default async function ConnectorTypePage() {
  const connectorTypes = await getData();
  return (
    <div className="container mx-auto mt-4 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="relative pt-8 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                <div className="bg-primary ring-primary/10 relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl ring-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <Plug className="text-primary-foreground h-8 w-8 drop-shadow-lg" />
                </div>
                <div className="space-y-1.5">
                  <CardTitle className="text-foreground text-4xl font-semibold">
                    Quản lý Cổng Kết Nối
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/90 text-base font-medium">
                    Quản lý và theo dõi các loại cổng kết nối sạc xe điện một
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
                <span className="relative font-semibold">Thêm Cổng Mới</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="dark:bg-card/50 overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Danh sách cổng kết nối</CardTitle>
          <CardDescription>
            Tất cả các loại cổng kết nối trong hệ thống với thông tin chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectorTypesTable data={connectorTypes} />
        </CardContent>
      </Card>
    </div>
  );
}
