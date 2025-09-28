import { ConnectorTypesTable } from "@/components/dashboard/admin/connector-type/connector-types-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Plug } from "lucide-react";

export interface ConnectorType {
  id: number;
  name: string;
  description: string;
  maxPowerKw: number;
  createdAt: Date;
  updatedAt: Date;
}

async function getData(): Promise<ConnectorType[]> {
  // Mock data - replace with actual API call
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
        <CardHeader className="pt-2 pb-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                  <Plug className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-3xl">
                    Quản lý Cổng Kết Nối
                  </CardTitle>
                  <CardDescription className="text-base">
                    Quản lý các loại cổng kết nối sạc xe điện
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Thêm Cổng Mới
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
              <CardTitle className="text-lg">Danh sách cổng kết nối</CardTitle>
              <CardDescription>
                Tất cả các loại cổng kết nối trong hệ thống
              </CardDescription>
            </div>
            <div className="bg-muted rounded-full px-3 py-1.5">
              <span className="text-sm font-medium">
                {connectorTypes.length}
              </span>
              <span className="text-muted-foreground ml-1 text-xs">cổng</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ConnectorTypesTable data={connectorTypes} />
        </CardContent>
      </Card>
    </div>
  );
}
