import { getUser } from "@/lib/auth/auth-server";
import {
  getStationChargers,
  getStationSessions,
} from "@/actions/stations-actions";
import { ChargersTable } from "@/components/dashboard/stations/charger-table";
import { SessionsTable } from "@/components/dashboard/stations/session-table";
import type { SessionRow } from "@/components/dashboard/stations/session-table-columns";
import SectionHeader from "@/components/dashboard/shared/section-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Table primitives removed — bookings now use SharedDataTable via BookingsTable
import {
  Activity,
  Battery,
  Calendar,
  Plus,
  TrendingUp,
  Zap,
} from "lucide-react";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import bookingColumns from "@/components/dashboard/stations/bookings-table-columns";
import { forbidden, notFound } from "next/navigation";
import StationDockCreate from "@/components/dashboard/staff/station/station-dock-create";
import { ChargerUpdateProvider } from "@/contexts/charger-update-context";
import UpdateCharger from "@/components/dashboard/stations/charger-edit-dialog";
import { getConnectorTypes } from "@/app/(app-layout)/dashboard/(admin-layout)/admin/connector-type/page";
import SectionContent from "@/components/dashboard/shared/section-content";

export async function getStationById(id: string, token: string) {
  const url = `https://api.go-electrify.com/api/v1/stations/${encodeURIComponent(id)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch station");
  }

  const station = await response.json();
  return station;
}

interface StationBooking {
  id: number;
  code: string;
  status: string;
  scheduledStart: string;
  initialSoc: number | null;
  estimatedCost: number | null;
  stationId: number;
  connectorTypeId: number;
  vehicleModelId: number;
}

// Booking status mapping moved into the bookings table columns so the table
// component owns its own display logic.

export async function getBookingsByStationId(stationId: string, token: string) {
  const url = `https://api.go-electrify.com/api/v1/stations/${encodeURIComponent(
    stationId,
  )}/bookings`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  const payload = (await response.json()) as {
    ok?: boolean;
    data?: Array<{
      Id: number;
      Code: string;
      Status: string;
      ScheduledStart: string;
      InitialSoc: number | null;
      StationId: number;
      ConnectorTypeId: number;
      VehicleModelId: number;
      EstimatedCost: number | null;
    }>;
  };

  const bookings = Array.isArray(payload?.data)
    ? payload.data.map((booking) => ({
        id: booking.Id,
        code: booking.Code,
        status: booking.Status,
        scheduledStart: booking.ScheduledStart,
        initialSoc: booking.InitialSoc,
        estimatedCost: booking.EstimatedCost,
        stationId: booking.StationId,
        connectorTypeId: booking.ConnectorTypeId,
        vehicleModelId: booking.VehicleModelId,
      }))
    : [];

  return bookings satisfies StationBooking[];
}

export default async function StationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, token } = await getUser();
  if (!user) {
    forbidden();
  }

  const role = user.role.toLowerCase();
  if (role !== "admin" && role !== "staff") {
    forbidden();
  }

  if (Number.isNaN(id)) {
    notFound();
  }

  const station = await getStationById(id, token ?? "");
  if (!station) {
    notFound();
  }

  const chargers = await getStationChargers(id, token ?? "");
  const bookings = await getBookingsByStationId(id, token ?? "");
  const stationSessions = await getStationSessions(id, token ?? "");

  const chargerCodeById = new Map(
    (chargers ?? []).map((charger) => [charger.id, charger.code] as const),
  );

  const sessions: SessionRow[] = stationSessions
    .map((session) => ({
      id: session.id,
      chargerId: session.chargerId,
      chargerCode: chargerCodeById.get(session.chargerId) ?? null,
      bookingId: session.bookingId,
      status: session.status,
      startedAt: session.startedAt,
      initialSoc: session.initialSoc,
      targetSoc: session.targetSoc,
      chargerPowerKw: session.chargerPowerKw,
      vehicleMaxPowerKw: session.vehicleMaxPowerKw,
      vehicleBatteryCapacityKwh: session.vehicleBatteryCapacityKwh,
      connectorMaxPowerKw: session.connectorMaxPowerKw,
    }))
    .sort((a, b) => {
      const aTime = new Date(a.startedAt).getTime();
      const bTime = new Date(b.startedAt).getTime();
      if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
      return bTime - aTime;
    });
  const connectorTypes = await getConnectorTypes();

  // Calculate stats
  const totalChargers = chargers?.length ?? 0;
  const activeChargers =
    chargers?.filter((c) => c.status === "ONLINE")?.length ?? 0;
  const activeSessions = sessions.filter((session) => {
    const normalized = session.status.toLowerCase();
    return ["active", "charging", "in_progress"].includes(normalized);
  }).length;
  const upcomingBookings = bookings.length;
  const utilizationRate =
    totalChargers > 0 ? Math.round((activeSessions / totalChargers) * 100) : 0;

  // Date/currency formatting is handled inside the bookings table columns.

  return (
    <div className="flex flex-col gap-6 p-4 md:gap-6 md:p-6">
      <SectionHeader title={station.Name} subtitle={station.Address}>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button variant="outline" size="lg">
            <Activity className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Xem Lịch Sử</span>
            <span className="sm:hidden">Lịch Sử</span>
          </Button>
          <StationDockCreate
            connectorTypes={connectorTypes}
            stationId={Number(id)}
          />
        </div>
      </SectionHeader>

      {/* Stats Overview */}
      <SectionContent>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm">
                Tổng Dock
              </CardTitle>
              <Battery className="text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl font-bold sm:text-2xl">
                {totalChargers}
              </div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                {activeChargers} đang hoạt động
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm">
                Phiên Đang Sạc
              </CardTitle>
              <Zap className="text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl font-bold sm:text-2xl">
                {activeSessions}
              </div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                Đang hoạt động
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm">
                Giữ Chỗ
              </CardTitle>
              <Calendar className="text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl font-bold sm:text-2xl">
                {upcomingBookings}
              </div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                Sắp tới
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm">
                Tỷ Lệ Sử Dụng
              </CardTitle>
              <TrendingUp className="text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl font-bold sm:text-2xl">
                {utilizationRate}%
              </div>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                Công suất hiện tại
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chargers Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Battery className="h-4 w-4 sm:h-5 sm:w-5" />
                  Danh sách Dock Sạc
                </CardTitle>
                <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
                  Quản lý và theo dõi trạng thái các dock sạc trong trạm
                </CardDescription>
              </div>
              <Badge variant="secondary" className="w-fit text-xs">
                {totalChargers} dock
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {totalChargers === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center sm:py-12">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20">
                  <Battery className="text-muted-foreground h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <h3 className="mt-3 text-base font-semibold sm:mt-4 sm:text-lg">
                  Chưa có dock sạc
                </h3>
                <p className="text-muted-foreground mt-1.5 max-w-sm text-xs sm:mt-2 sm:text-sm">
                  Thêm dock sạc đầu tiên để bắt đầu cung cấp dịch vụ sạc điện
                </p>
                <Button className="mt-3 sm:mt-4" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Dock Đầu Tiên
                </Button>
              </div>
            ) : (
              <div className="p-3 sm:p-6">
                <ChargerUpdateProvider>
                  <ChargersTable data={chargers} />
                  <UpdateCharger connectorTypes={connectorTypes} />
                </ChargerUpdateProvider>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  Phiên Sạc & Giữ Chỗ
                </CardTitle>
                <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
                  Theo dõi các phiên sạc đang diễn ra và lịch giữ chỗ sắp tới
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="text-[10px] sm:text-xs">
                  {activeSessions} đang sạc
                </Badge>
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  {upcomingBookings} giữ chỗ
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-3 sm:p-6">
              <SessionsTable data={sessions} />
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  Lịch Giữ Chỗ
                </CardTitle>
                <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
                  Danh sách các lượt giữ chỗ đã lên lịch cho trạm này
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px] sm:text-xs">
                {upcomingBookings} giữ chỗ
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-3 sm:p-6">
              <SharedDataTable
                columns={bookingColumns}
                data={bookings}
                searchColumn="code"
                searchPlaceholder="Tìm kiếm mã giữ chỗ..."
                emptyTitle="Chưa có giữ chỗ"
                emptyMessage="Khách hàng chưa đăng ký giữ chỗ nào cho trạm này."
              />
            </div>
          </CardContent>
        </Card>
      </SectionContent>
    </div>
  );
}
