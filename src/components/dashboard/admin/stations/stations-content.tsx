import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Zap,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { getBackendUrl } from "@/lib/utils";

interface StationWithDistance {
  id: number;
  name: string;
  coordinates: [number, number];
  type: string;
  address: string;
  available: boolean;
  available_connectors: number;
  total_connectors: number;
  distance?: number;
}

export async function StationsContent() {
  const response = await fetch(getBackendUrl("api/stations"));
  const stations: StationWithDistance[] = await response.json();

  const transformedStations = stations.map((station) => ({
    id: `ST-${station.id.toString().padStart(3, "0")}`,
    name: station.name,
    status: station.available ? "ACTIVE" : "MAINTENANCE",
    usage:
      station.total_connectors > 0
        ? Math.round(
            ((station.total_connectors - station.available_connectors) /
              station.total_connectors) *
              100,
          )
        : 0,
    sessions: station.total_connectors - station.available_connectors,
  }));

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Quản Lý Trạm Sạc
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Tổng quan và trạng thái của tất cả các trạm sạc
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Xuất dữ liệu (CSV)
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            Thêm trạm
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">
              Trạng thái trạm
            </CardTitle>
            <CardDescription className="text-sm">
              Trạng thái thời gian thực của tất cả trạm sạc
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-3 sm:space-y-4">
              {transformedStations.map((station) => (
                <div
                  key={station.id}
                  className="border-border flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium sm:text-base">
                          {station.name}
                        </span>
                        <Badge
                          variant={
                            station.status === "ACTIVE"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {station.status === "ACTIVE" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          {station.status === "ACTIVE"
                            ? "Hoạt động"
                            : "Bảo trì"}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        {station.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:gap-4">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-medium sm:text-sm">
                        {station.sessions} phiên
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {station.usage}% công suất
                      </div>
                    </div>
                    <div className="w-16 sm:w-24">
                      <Progress value={station.usage} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">
                Hành động nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <Button
                className="w-full justify-start bg-transparent text-sm"
                variant="outline"
                size="sm"
              >
                <Zap className="mr-2 h-4 w-4" />
                Thêm trạm mới
              </Button>
              <Button
                className="w-full justify-start bg-transparent text-sm"
                variant="outline"
                size="sm"
              >
                <Activity className="mr-2 h-4 w-4" />
                Tạo báo cáo
              </Button>
              <Button
                className="w-full justify-start bg-transparent text-sm"
                variant="outline"
                size="sm"
              >
                <Users className="mr-2 h-4 w-4" />
                Quản lý người dùng
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">
                Cảnh báo gần đây
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-border flex items-start gap-3 rounded-lg border p-3">
                <AlertTriangle className="text-chart-5 mt-0.5 h-4 w-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Trạm ST-003 ngoại tuyến</p>
                  <p className="text-muted-foreground text-xs">Cần bảo trì</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Clock className="text-muted-foreground h-3 w-3" />
                    <span className="text-muted-foreground text-xs">
                      2 giờ trước
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-border flex items-start gap-3 rounded-lg border p-3">
                <CheckCircle className="text-chart-3 mt-0.5 h-4 w-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cảnh báo sử dụng cao</p>
                  <p className="text-muted-foreground text-xs">
                    ST-002 ở mức 92% công suất
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Clock className="text-muted-foreground h-3 w-3" />
                    <span className="text-muted-foreground text-xs">
                      15 phút trước
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
