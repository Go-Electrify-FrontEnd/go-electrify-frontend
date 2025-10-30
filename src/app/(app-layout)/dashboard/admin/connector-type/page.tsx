import { ConnectorTypesTable } from "@/features/connector-type/components/connector-type-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectorTypeSchema } from "@/features/connector-type/schemas/connector-type.schema";
import type { ConnectorType } from "@/features/connector-type/schemas/connector-type.types";
import { z } from "zod";
import ConnectorTypeCreateDialog from "@/features/connector-type/components/connector-type-create-dialog";
import SectionHeader from "@/components/shared/section-header";
import { ConnectorTypeUpdateProvider } from "@/contexts/connector-type-update-context";
import { UpdateConnectorType } from "@/features/connector-type/components/connector-type-edit-dialog";
import { getUser } from "@/lib/auth/auth-server";
import SectionContent from "@/components/shared/section-content";

export async function getConnectorTypes(): Promise<ConnectorType[]> {
  try {
    const { token } = await getUser();
    const url = "https://api.go-electrify.com/api/v1/connector-types";
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600, tags: ["connector-types"] },
    });
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
      <SectionHeader
        title={"Quản lý Cổng Kết Nối"}
        subtitle={
          "Quản lý và theo dõi các loại cổng kết nối sạc xe điện một cách hiệu quả"
        }
      >
        <ConnectorTypeCreateDialog />
      </SectionHeader>

      <SectionContent>
        <ConnectorTypeUpdateProvider>
          <ConnectorTypesTable data={connectorTypes} />
          <UpdateConnectorType />
        </ConnectorTypeUpdateProvider>
      </SectionContent>
    </div>
  );
}
