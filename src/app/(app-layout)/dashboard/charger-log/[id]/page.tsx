import { forbidden, notFound } from "next/navigation";
import { getChargerLogs } from "@/features/charger-log/api/charger-log";
import { ChargerLogTable } from "@/features/charger-log/components/charger-log-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import SectionHeader from "@/components/section-header";
import SectionContent from "@/components/section-content";
import { getUser } from "@/lib/auth/auth-server";
import {
  getSelfStation,
  getStationChargers,
} from "@/features/stations/api/stations-api";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function ChargerLogContent({
  chargerId,
  page,
}: {
  chargerId: number;
  page: number;
}) {
  const pageSize = 50;
  const result = await getChargerLogs(chargerId, page, pageSize, "desc");

  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-muted-foreground text-center">
            Không thể tải dữ liệu log. Vui lòng thử lại sau.
          </div>
        </CardContent>
      </Card>
    );
  }

  const { data } = result;
  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <ChargerLogTable
      data={data.items}
      currentPage={page}
      totalPages={totalPages}
      totalItems={data.total}
      pageSize={pageSize}
    />
  );
}

export default async function ChargerLogPage({
  params,
  searchParams,
}: PageProps) {
  const { user, token } = await getUser();
  if (!user || !token) {
    notFound();
  }

  if (
    user.role.toLowerCase() !== "admin" &&
    user.role.toLowerCase() !== "staff"
  ) {
    forbidden();
  }

  const { id } = await params;
  const { page: pageParam } = await searchParams;

  const chargerId = parseInt(id, 10);

  if (isNaN(chargerId)) {
    notFound();
  }

  const page = pageParam ? parseInt(pageParam, 10) : 1;

  if (user.role.toLowerCase() === "staff") {
    const station = await getSelfStation(token);
    if (!station) {
      notFound();
    }

    const chargers = await getStationChargers(station.id.toString(10), token);
    const chargerExists = chargers.some((c) => c.id === chargerId);
    if (!chargerExists) {
      notFound();
    }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-6">
      <SectionHeader
        title={`Log Bộ Sạc #${chargerId}`}
        subtitle="Chi tiết log hoạt động của bộ sạc"
      />

      <SectionContent>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              Lịch sử hoạt động
            </CardTitle>
            <CardDescription>
              Dữ liệu ghi nhận từ bộ sạc, bao gồm điện áp, dòng điện, công suất
              và trạng thái
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChargerLogContent chargerId={chargerId} page={page} />
          </CardContent>
        </Card>
      </SectionContent>
    </div>
  );
}
