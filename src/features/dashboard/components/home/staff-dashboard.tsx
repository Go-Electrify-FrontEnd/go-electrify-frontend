import { User } from "@/lib/zod/user/user.types";
import {
  MapPin,
  Zap,
  Users,
  TrendingUp,
  AlertCircle,
  Activity,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionHeader from "@/components/dashboard/shared/section-header";
import type { StaffStats } from "@/types/dashboard-stats";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { type ChartConfig } from "@/components/ui/chart";
import { BarChartWrapper } from "./client-charts";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface StaffDashboardProps {
  user: User;
  token?: string;
  stats: StaffStats;
}

export function StaffDashboard({ user, token, stats }: StaffDashboardProps) {
  const utilizationRate =
    stats.totalStations > 0
      ? (stats.activeStations / stats.totalStations) * 100
      : 0;

  // Mock data for chart
  const activityData = [
    { day: "T2", sessions: Math.floor(stats.activeSessions * 0.8) },
    { day: "T3", sessions: Math.floor(stats.activeSessions * 1.2) },
    { day: "T4", sessions: Math.floor(stats.activeSessions * 0.9) },
    { day: "T5", sessions: Math.floor(stats.activeSessions * 1.5) },
    { day: "T6", sessions: stats.activeSessions },
  ];

  const chartConfig = {
    sessions: {
      label: "Phiên sạc",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={`Xin chào, ${user.name || user.email}!`}
        subtitle="Quản lý trạm sạc và hỗ trợ khách hàng"
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trạm Sạc</CardTitle>
            <MapPin className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStations}</div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Badge variant="outline" className="text-xs">
                {stats.activeStations} hoạt động
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang Sạc</CardTitle>
            <Zap className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <p className="text-muted-foreground text-xs">Phiên đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ Xác Nhận</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReservations}</div>
            <p className="text-muted-foreground text-xs">Lịch sắp tới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách Hàng</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-muted-foreground text-xs">Người dùng</p>
          </CardContent>
        </Card>
      </div>

      {/* Station Activity & Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tình Trạng Trạm Sạc</CardTitle>
            <CardDescription>Tỷ lệ hoạt động và trạng thái</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tỷ lệ hoạt động</span>
                <span className="font-bold">{utilizationRate.toFixed(1)}%</span>
              </div>
              <Progress value={utilizationRate} className="h-2" />
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Hoạt động</span>
                </div>
                <span className="text-sm font-semibold">{stats.activeStations}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Không hoạt động</span>
                </div>
                <span className="text-sm font-semibold">{stats.totalStations - stats.activeStations}</span>
              </div>
            </div>
            <Link
              href="/dashboard/admin/stations"
              className="text-primary block text-sm font-medium hover:underline"
            >
              Quản lý trạm sạc →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt Động Trong Tuần</CardTitle>
            <CardDescription>Số phiên sạc theo ngày</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartWrapper
              data={activityData}
              dataKey="sessions"
              config={chartConfig}
              xAxisKey="day"
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/admin/stations" className="block">
          <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5" />
                Quản Lý Trạm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Xem và cập nhật tất cả trạm sạc
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/admin/users" className="block">
          <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" />
                Quản Lý Khách Hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Xem danh sách và hỗ trợ người dùng
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/reservations" className="block">
          <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5" />
                Theo Dõi Hoạt Động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Giám sát phiên sạc và đặt chỗ
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng Quan Hệ Thống</CardTitle>
          <CardDescription>Trạng thái và số liệu quan trọng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Phiên sạc đang hoạt động</p>
              <p className="text-2xl font-bold">{stats.activeSessions}</p>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="mr-1 h-3 w-3" />
                Đang theo dõi
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Đặt chỗ chờ xử lý</p>
              <p className="text-2xl font-bold">{stats.pendingReservations}</p>
              <Badge variant="outline" className="text-xs">
                {stats.pendingReservations > 5 ? "Cần xem xét" : "Bình thường"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
