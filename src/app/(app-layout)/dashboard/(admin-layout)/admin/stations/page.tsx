import SectionHeader from "@/components/shared/section-header";
import StationCreate from "@/features/stations/components/station-create-dialog";
import { StationsTable } from "@/features/stations/components/station-table";
import { StationApiSchema } from "@/lib/zod/station/station.schema";
import type { Station } from "@/lib/zod/station/station.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionContent from "@/components/shared/section-content";

export async function getStations(): Promise<Station[]> {
  const url = "https://api.go-electrify.com/api/v1/stations";
  const response = await fetch(url, {
    method: "GET",
    next: { revalidate: 60, tags: ["stations"] },
  });

  if (!response.ok) {
    console.error("Failed to fetch stations, status: " + response.status);
    return [];
  }

  const parsed = StationApiSchema.array().safeParse(await response.json());
  if (!parsed.success) {
    console.error("Failed to parse stations:", parsed.error);
    return [];
  }

  return parsed.data;
}

export default async function StationsManagementPage() {
  const stations = await getStations();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title={"Quản lý Trạm Sạc"}
        subtitle={"Quản lý và theo dõi các trạm sạc xe điện trong hệ thống"}
      >
        <StationCreate />
      </SectionHeader>

      <SectionContent>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Danh sách trạm</CardTitle>
            <CardDescription>
              Tất cả các trạm sạc trong hệ thống với thông tin chi tiết
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StationsTable data={stations} />
          </CardContent>
        </Card>
      </SectionContent>
    </div>
  );
}
