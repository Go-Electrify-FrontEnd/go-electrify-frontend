import { ConnectorTypesTable } from "@/components/dashboard/admin/connector-type/connector-type-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectorType, ConnectorTypeSchema } from "@/types/connector";
import { z } from "zod";
import ConnectorTypeCreateDialog from "@/components/dashboard/admin/connector-type/connector-type-create-dialog";
import { Plug } from "lucide-react";
import { ConnectorTypeUpdateProvider } from "@/contexts/connector-type-update-context";
import { UpdateConnectorType } from "@/components/dashboard/admin/connector-type/connector-type-edit-dialog";

export async function getConnectorTypes(): Promise<ConnectorType[]> {
  const url = "https://api.go-electrify.com/api/v1/connector-types";
  const response = await fetch(url, {
    method: "GET",
    next: { revalidate: 3600, tags: ["connector-types"] },
  });
  try {
    const data = await response.json();
    const parsed = z.array(ConnectorTypeSchema).safeParse(data);
    if (!parsed.success) {
      console.error("Invalid connector types data:", parsed.error);
      return [];
    }
    return parsed.data;
  } catch (error) {
    console.error("Error fetching connector types:", error);
    return [];
  }
}

export default async function ConnectorTypePage() {
  const connectorTypes = await getConnectorTypes();
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
              <ConnectorTypeCreateDialog />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Danh sách cổng kết nối</CardTitle>
          <CardDescription>
            Tất cả các loại cổng kết nối trong hệ thống với thông tin chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectorTypeUpdateProvider>
            <ConnectorTypesTable data={connectorTypes} />
            <UpdateConnectorType />
          </ConnectorTypeUpdateProvider>
        </CardContent>
      </Card>
    </div>
  );
}
