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
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header (plain text, not a card) */}
      <div className="relative pt-8 pb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-5">
              <div className="space-y-1.5">
                <h1 className="text-foreground text-4xl font-semibold">
                  Quản lý Cổng Kết Nối
                </h1>
                <p className="text-muted-foreground/90 text-base font-medium">
                  Quản lý và theo dõi các loại cổng kết nối sạc xe điện một cách
                  hiệu quả
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ConnectorTypeCreateDialog />
          </div>
        </div>
      </div>

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
