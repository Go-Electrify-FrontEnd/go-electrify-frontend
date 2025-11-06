import { User } from "@/features/users/schemas/user.types";
import {
  Wallet,
  Calendar,
  Zap,
  TrendingUp,
  MapPin,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { DriverStats } from "@/features/dashboard/types/dashboard-stats";
import Link from "next/link";
import SectionHeader from "@/components/section-header";
import SectionContent from "@/components/section-content";
import { Transaction } from "@/features/wallet/schemas/wallet.schema";
import StatCard from "../shared/stat-card";
import { formatCurrencyVND } from "@/lib/formatters";

interface DriverDashboardProps {
  user: User;
  stats: DriverStats;
  transactions: Transaction[];
}

export function DriverDashboard({
  user,
  stats,
  transactions,
}: DriverDashboardProps) {
  const averageCostPerSession =
    stats.chargingSessions > 0 ? stats.totalSpent / stats.chargingSessions : 0;

  const getTransactionTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      DEPOSIT: "Nạp tiền",
      DEPOSIT_MANUAL: "Nạp tiền",
      CHARGING: "Thanh toán sạc",
      BOOKING_FEE: "Phí đặt chỗ",
      REFUND: "Hoàn tiền",
      SUBSCRIPTION: "Đăng ký gói",
      SUBSCRIPTION_USAGE: "Sử dụng gói",
    };

    return typeLabels[type] || type;
  };

  const getTransactionColor = (type: string) => {
    return type === "DEPOSIT" || type === "DEPOSIT_MANUAL" || type === "REFUND"
      ? "text-green-600"
      : "text-red-600";
  };

  const getTransactionSign = (type: string) => {
    return type === "DEPOSIT" || type === "DEPOSIT_MANUAL" || type === "REFUND"
      ? "+"
      : "-";
  };

  return (
    <div>
      <SectionHeader
        title={`Xin chào, ${user.name || user.email}!`}
        subtitle="Tổng quan hoạt động sạc điện của bạn"
      />

      <SectionContent className="mt-8 space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Số Dư Ví"
            icon={<Wallet className="text-muted-foreground h-4 w-4" />}
            value={formatCurrencyVND(stats.walletBalance)}
          >
            <Link
              href="/dashboard/wallet"
              className="text-primary text-xs hover:underline"
            >
              Nạp tiền →
            </Link>
          </StatCard>

          <StatCard
            title="Đặt Chỗ"
            icon={<Calendar className="text-muted-foreground h-4 w-4" />}
            value={stats.upcomingReservations}
          >
            Lịch sắp tới
          </StatCard>

          <StatCard
            title="Phiên Sạc"
            icon={<Zap className="text-muted-foreground h-4 w-4" />}
            value={stats.chargingSessions}
          >
            Tổng số phiên
          </StatCard>

          <StatCard
            title="Chi Tiêu"
            icon={<TrendingUp className="text-muted-foreground h-4 w-4" />}
            value={formatCurrencyVND(stats.totalSpent)}
          >
            Tích lũy
          </StatCard>
        </div>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Thống Kê Hoạt Động</CardTitle>
            <CardDescription>
              Tổng quan chi tiết về hoạt động sạc điện của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Activity className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Tổng phiên sạc</span>
                  </div>
                  <span className="text-lg font-bold">
                    {stats.chargingSessions}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">
                      Chi phí TB/phiên
                    </span>
                  </div>
                  <span className="text-lg font-bold">
                    {formatCurrencyVND(averageCostPerSession)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Tổng chi tiêu</span>
                  </div>
                  <span className="text-lg font-bold">
                    {formatCurrencyVND(stats.totalSpent)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Đặt chỗ sắp tới</span>
                  </div>
                  <span className="text-lg font-bold">
                    {stats.upcomingReservations}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/stations-nearby" className="block">
            <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5" />
                  Tìm Trạm Gần Đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Khám phá trạm sạc xung quanh bạn
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/reservations" className="block">
            <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5" />
                  Quản Lý Đặt Chỗ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Xem và quản lý lịch đặt chỗ
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/charging-history" className="block">
            <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-5 w-5" />
                  Lịch Sử Sạc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Theo dõi các phiên sạc đã thực hiện
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/wallet" className="block">
            <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wallet className="h-5 w-5" />
                  Quản Lý Ví
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Nạp tiền và xem giao dịch
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Transactions */}
        {transactions && transactions.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Giao Dịch Gần Đây</CardTitle>
                  <CardDescription>
                    5 giao dịch gần đây trong ví của bạn
                  </CardDescription>
                </div>
                <Link
                  href="/dashboard/wallet"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Xem Tất Cả
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="hover:bg-accent/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {getTransactionTypeLabel(transaction.type)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(transaction.createdAt).toLocaleString(
                          "vi-VN",
                        )}
                      </p>
                      {transaction.note && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          {transaction.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${getTransactionColor(
                          transaction.type,
                        )}`}
                      >
                        {getTransactionSign(transaction.type)}
                        {formatCurrencyVND(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </SectionContent>
    </div>
  );
}
