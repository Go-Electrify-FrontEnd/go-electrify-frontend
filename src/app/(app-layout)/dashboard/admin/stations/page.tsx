import SectionHeader from "@/components/section-header";
import StationCreate from "@/features/stations/components/station-create-dialog";
import { StationsTable } from "@/features/stations/components/station-table";
import SectionContent from "@/components/section-content";
import { getStations } from "@/features/stations/services/stations-api";

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
        <StationsTable data={stations} />
      </SectionContent>
    </div>
  );
}
