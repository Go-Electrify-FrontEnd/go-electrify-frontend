import { getUser } from "@/lib/auth/auth-server";
import { ChargersTable } from "@/features/stations/components/charger-table";
import { SessionsTable } from "@/features/stations/components/session-table";
import type { SessionRow } from "@/features/stations/components/session-table-columns";
import SectionHeader from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Battery,
  Calendar,
  Download,
  Filter,
  MoreVertical,
  Plus,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import bookingColumns from "@/features/stations/components/bookings-table-columns";
import { notFound } from "next/navigation";
import StationDockCreate from "@/features/stations/components/station-dock-create";
import { ChargerUpdateProvider } from "@/features/stations/contexts/charger-update-context";
import UpdateCharger from "@/features/stations/components/charger-edit-dialog";
import SectionContent from "@/components/shared/section-content";
import {
  getSelfStationId,
  getStationChargers,
} from "@/features/stations/api/stations-api";
import { stationStaffColumns } from "@/features/stations/components/station-staff-table-columns";
import {
  getBookingsByStationId,
  getStationById,
  getStationStaff,
} from "@/features/stations/api/stations-api";
import { getConnectorTypes } from "@/features/connector-type/services/connector-type-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function StationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (Number.isNaN(id)) {
    notFound();
  }

  const { token, user } = await getUser();

  if (user!.role.toLowerCase() === "staff") {
    const stationId = await getSelfStationId(token!);
    if (stationId && Number(stationId) !== Number(id)) {
      notFound();
    }
  }

  const station = await getStationById(id, token!);
  if (!station) {
    notFound();
  }

  const chargers = await getStationChargers(id, token!);
  const bookings = await getBookingsByStationId(id, token!);
  const connectorTypes = await getConnectorTypes();
  const sessions: SessionRow[] = [];

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

  return (
    <div className="flex flex-col gap-6 md:gap-6">
      <SectionHeader title={station.name} subtitle={station.address}>
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

      <SectionContent>
        {/* Stats Overview */}
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-2 @5xl/main:grid-cols-4">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Tổng Dock</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {totalChargers}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Battery className="size-4" />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {activeChargers} đang hoạt động <Zap className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Quản lý dock sạc trong trạm
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Phiên Đang Sạc</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {activeSessions}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Zap className="size-4" />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Đang hoạt động <Activity className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Theo dõi phiên sạc hiện tại
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Giữ Chỗ</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {upcomingBookings}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Calendar className="size-4" />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Sắp tới <Calendar className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Lịch đặt chỗ trong trạm
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Tỷ Lệ Sử Dụng</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {utilizationRate}%
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingUp className="size-4" />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Công suất hiện tại <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Hiệu suất hoạt động trạm
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Utilization Chart
        <StationUtilizationChart
          stationName={station.name}
          currentUtilization={utilizationRate}
          activeSessions={activeSessions}
        /> */}

        {/* Chargers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Battery className="h-4 w-4 sm:h-5 sm:w-5" />
              Danh sách Dock Sạc
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
              Quản lý và theo dõi trạng thái các dock sạc trong trạm
            </CardDescription>
            <CardAction>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-[10px] sm:text-xs">
                  {totalChargers} dock
                </Badge>
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  {activeChargers} đang hoạt động
                </Badge>
              </div>
            </CardAction>
          </CardHeader>

          <CardContent className="p-0">
            <div className="p-3 sm:p-6">
              <ChargerUpdateProvider>
                <ChargersTable data={chargers} />
                <UpdateCharger connectorTypes={connectorTypes} />
              </ChargerUpdateProvider>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              Phiên Sạc & Giữ Chỗ
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
              Theo dõi các phiên sạc đang diễn ra và lịch giữ chỗ sắp tới
            </CardDescription>
            <CardAction>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="text-[10px] sm:text-xs">
                  {activeSessions} đang sạc
                </Badge>
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  {upcomingBookings} giữ chỗ
                </Badge>
              </div>
            </CardAction>
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
              <CardAction>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    {upcomingBookings} giữ chỗ
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất dữ liệu
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Xem lịch
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Filter className="mr-2 h-4 w-4" />
                        Bộ lọc nâng cao
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardAction>
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
        {user!.role.toLowerCase() === "admin" && (
          <StationStaffTable stationId={id} />
        )}
      </SectionContent>
    </div>
  );
}

async function StationStaffTable({ stationId }: { stationId: string }) {
  const { token } = await getUser();
  const staff = await getStationStaff(stationId, token!);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Nhân Viên Trạm
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
              Danh sách nhân viên được phân công quản lý trạm này
            </CardDescription>
          </div>
          <CardAction>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="default">
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Phân công nhân viên</span>
                <span className="sm:hidden">Thêm</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Xuất danh sách
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    Quản lý vai trò
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Activity className="mr-2 h-4 w-4" />
                    Xem lịch sử hoạt động
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-3 sm:p-6">
          <SharedDataTable
            columns={stationStaffColumns}
            data={staff}
            searchColumn="userEmail"
            searchPlaceholder="Tìm kiếm email nhân viên..."
            emptyTitle="Chưa có nhân viên"
            emptyMessage="Chưa có nhân viên nào được phân công cho trạm này. Nhấn nút phía trên để thêm nhân viên."
          />
        </div>
      </CardContent>
    </Card>
  );
}
