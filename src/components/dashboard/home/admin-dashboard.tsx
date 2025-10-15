"use client";

import { User } from "@/lib/zod/user/user.types";
import {
  MapPin,
  Users,
  Car,
  Plug,
  Package,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionHeader from "@/components/dashboard/shared/section-header";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AdminStats } from "@/types/dashboard-stats";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, LabelList } from "recharts";
import Link from "next/link";
import { ResourceUtilizationPie } from "./resource-utilization";
import { RoleDistributionCard } from "./role-distribution";

interface AdminDashboardProps {
  user: User;
  token?: string;
  stats: AdminStats;
}

export function AdminDashboard({ user, token, stats }: AdminDashboardProps) {
  const utilizationRate =
    stats.totalStations > 0
      ? (stats.activeStations / stats.totalStations) * 100
      : 0;

  const resourceData = [
    {
      name: "stations",
      value: stats.totalStations,
      fill: "var(--color-stations)",
    },
    {
      name: "users",
      value: stats.totalUsers,
      fill: "var(--color-users)",
    },
    {
      name: "reservations",
      value: stats.totalReservations,
      fill: "var(--color-reservations)",
    },
    {
      name: "subscriptions",
      value: stats.totalSubscriptions,
      fill: "var(--color-subscriptions)",
    },
  ];

  const roleData = [
    { role: "Tài xế", count: stats.roleBreakdown.driver },
    { role: "Nhân viên", count: stats.roleBreakdown.staff },
    { role: "Quản trị", count: stats.roleBreakdown.admin },
  ];

  const chartConfig = {
    desktop: {
      label: "NNgười Dùng",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={`Chào mừng quản trị viên, ${user.name || user.email}!`}
        subtitle="Tổng quan hệ thống và quản lý toàn diện"
      />

      {/* Primary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trạm Sạc</CardTitle>
            <MapPin className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStations}</div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <Badge variant="outline" className="text-xs">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {stats.activeStations} hoạt động
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người Dùng</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-muted-foreground text-xs">
              {stats.roleBreakdown.driver} tài xế
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loại Cổng</CardTitle>
            <Plug className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalConnectorTypes}
            </div>
            <p className="text-muted-foreground text-xs">Chuẩn kết nối</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mẫu Xe</CardTitle>
            <Car className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicleModels}</div>
            <p className="text-muted-foreground text-xs">Xe điện hỗ trợ</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <ResourceUtilizationPie data={resourceData} />

        <RoleDistributionCard data={roleData} config={chartConfig} />
      </div>

      {/* System Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hiệu Suất Hệ Thống</CardTitle>
          <CardDescription>Thống kê và trạng thái hoạt động</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Tỷ lệ trạm hoạt động
                  </span>
                  <span className="text-sm font-bold">
                    {utilizationRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={utilizationRate} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Phiên đang sạc</span>
                  <span className="text-sm font-bold">
                    {stats.activeReservations}
                  </span>
                </div>
                <Progress
                  value={
                    stats.totalStations > 0
                      ? (stats.activeReservations / stats.totalStations) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Tổng đặt chỗ
                </span>
                <span className="text-lg font-bold">
                  {stats.totalReservations}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Gói dịch vụ
                </span>
                <span className="text-lg font-bold">
                  {stats.totalSubscriptions}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Tỷ lệ sử dụng
                </span>
                <Badge variant="secondary" className="text-sm">
                  {stats.totalStations > 0
                    ? Math.round(
                        (stats.activeReservations / stats.totalStations) * 100,
                      )
                    : 0}
                  %
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quản Lý Hệ Thống</CardTitle>
          <CardDescription>
            Truy cập nhanh các chức năng quản trị
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chức năng</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Trạm sạc
                  </div>
                </TableCell>
                <TableCell>{stats.totalStations}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {stats.activeStations} hoạt động
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href="/dashboard/admin/stations"
                    className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Quản lý <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Plug className="h-4 w-4" />
                    Loại cổng sạc
                  </div>
                </TableCell>
                <TableCell>{stats.totalConnectorTypes}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Chuẩn</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href="/dashboard/admin/connector-type"
                    className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Quản lý <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Mẫu xe điện
                  </div>
                </TableCell>
                <TableCell>{stats.totalVehicleModels}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Hỗ trợ</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href="/dashboard/admin/vehicle-models"
                    className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Quản lý <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Gói dịch vụ
                  </div>
                </TableCell>
                <TableCell>{stats.totalSubscriptions}</TableCell>
                <TableCell>
                  <Badge>Đang bán</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href="/dashboard/admin/subscriptions"
                    className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Quản lý <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
