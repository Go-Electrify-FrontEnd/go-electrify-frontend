import { User } from "@/lib/zod/user/user.types";
import { Wallet, Calendar, MapPin, TrendingUp, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type ChartConfig } from "@/components/ui/chart";
import { BarChartWrapper, LineChartWrapper } from "./client-charts";
import type { DriverStats } from "@/types/dashboard-stats";
import Link from "next/link";
import SectionHeader from "@/components/shared/section-header";
import { TransactionList } from "@/lib/zod/wallet/wallet.schema";

interface DriverDashboardProps {
  user: User;
  stats: DriverStats;
  transactions: TransactionList | null;
}

export async function DriverDashboard({
  user,
  stats,
  transactions,
}: DriverDashboardProps) {
  // Mock data for charts - in production, this would come from API
  const spendingData = [
    { month: "T7", amount: stats.totalSpent * 0.15 },
    { month: "T8", amount: stats.totalSpent * 0.2 },
    { month: "T9", amount: stats.totalSpent * 0.25 },
    { month: "T10", amount: stats.totalSpent * 0.4 },
  ];

  const sessionData = [
    { month: "T7", sessions: Math.floor(stats.chargingSessions * 0.2) },
    { month: "T8", sessions: Math.floor(stats.chargingSessions * 0.25) },
    { month: "T9", sessions: Math.floor(stats.chargingSessions * 0.3) },
    { month: "T10", sessions: Math.floor(stats.chargingSessions * 0.25) },
  ];

  const chartConfig = {
    amount: {
      label: "Chi tiêu",
      color: "hsl(var(--chart-1))",
    },
    sessions: {
      label: "Phiên sạc",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={`Xin chào, ${user.name || user.email}!`}
        subtitle="Tổng quan hoạt động sạc điện của bạn"
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số Dư Ví</CardTitle>
            <Wallet className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(stats.walletBalance)}
            </div>
            <Button variant="link" className="h-auto p-0 text-xs" asChild>
              <Link href="/dashboard/wallet">Nạp tiền →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đặt Chỗ</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.upcomingReservations}
            </div>
            <p className="text-muted-foreground text-xs">Lịch sắp tới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phiên Sạc</CardTitle>
            <Zap className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.chargingSessions}</div>
            <p className="text-muted-foreground text-xs">Tổng số phiên</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chi Tiêu</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(stats.totalSpent)}
            </div>
            <p className="text-muted-foreground text-xs">Tích lũy</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chi Tiêu Theo Tháng</CardTitle>
            <CardDescription>
              Biểu đồ chi phí sạc 4 tháng gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartWrapper
              data={spendingData}
              dataKey="amount"
              config={chartConfig}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phiên Sạc Theo Tháng</CardTitle>
            <CardDescription>
              Số lượng phiên sạc 4 tháng gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChartWrapper
              data={sessionData}
              dataKey="sessions"
              config={chartConfig}
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/stations-nearby" className="block">
          <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5" />
                Tìm Trạm Gần Đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Xem trạm sạc xung quanh và tình trạng hoạt động
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/reservations" className="block">
          <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5" />
                Quản Lý Đặt Chỗ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Đặt trước và quản lý lịch sạc của bạn
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/wallet" className="block">
          <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet className="h-5 w-5" />
                Quản Lý Ví
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Nạp tiền và xem lịch sử giao dịch
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng Quan Hoạt Động</CardTitle>
          <CardDescription>
            Thống kê chi tiết về hoạt động sạc điện
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Tổng phiên sạc</p>
              <p className="text-2xl font-bold">{stats.chargingSessions}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="mr-1 h-3 w-3" />
              Hoạt động tốt
            </Badge>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Chi phí trung bình/phiên
              </span>
              <span className="font-medium">
                {stats.chargingSessions > 0
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(stats.totalSpent / stats.chargingSessions)
                  : "0 ₫"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Đặt chỗ sắp tới</span>
              <span className="font-medium">
                {stats.upcomingReservations} lịch
              </span>
            </div>
          </div>
          <Button className="w-full" asChild>
            <Link href="/dashboard/wallet">Xem Chi Tiết Giao Dịch</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
