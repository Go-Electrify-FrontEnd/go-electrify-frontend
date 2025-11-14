"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, WalletIcon, Zap } from "lucide-react";
import { formatDateTime, formatShortCurrency } from "@/lib/formatters";
import { Transaction, Wallet } from "../schemas/wallet.schema";

interface WalletOverviewProps {
  wallet: Wallet;
  transactions: Transaction[];
}

export const typeLabels: Record<Transaction["type"], string> = {
  DEPOSIT: "Nạp tiền",
  BOOKING_FEE: "Phí đặt chỗ",
  CHARGING: "Sạc xe",
  REFUND: "Hoàn tiền",
  SUBSCRIPTION: "Mua gói",
  SUBSCRIPTION_USAGE: "Sử dụng gói",
  DEPOSIT_MANUAL: "Nạp tiền tại trạm",
};

export function WalletOverview({ wallet, transactions }: WalletOverviewProps) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const depositsThisMonth = transactions.filter((transaction) => {
    const date = transaction.createdAt;
    return (
      transaction.type === "DEPOSIT" &&
      transaction.status === "SUCCEEDED" &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  const totalDepositCurrentMonth = depositsThisMonth.reduce(
    (sum, t) => sum + t.amount,
    0,
  );

  const chargesThisMonth = transactions.filter((transaction) => {
    const date = transaction.createdAt;
    return (
      transaction.type === "CHARGING" &&
      transaction.status === "SUCCEEDED" &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  const totalSpentCurrentMonth = chargesThisMonth.reduce(
    (sum, t) => sum + t.amount,
    0,
  );

  const chargingSessionIds = new Set<number>();
  chargesThisMonth.forEach((t) => {
    if (t.chargingSession) {
      chargingSessionIds.add(t.chargingSession);
    }
  });

  const chargingSessionsCount =
    chargingSessionIds.size > 0
      ? chargingSessionIds.size
      : chargesThisMonth.length;

  // Determine last transaction (by createdAt) and render a short summary
  let lastActivity = "Chưa có giao dịch";
  if (transactions.length > 0) {
    const latest = transactions.reduce((prev, curr) => {
      const pd = prev.createdAt;
      const cd = curr.createdAt;
      return cd > pd ? curr : prev;
    });
    const latestDate = latest.createdAt;
    const formatted = formatDateTime(latestDate);
    const sign =
      latest.type === "DEPOSIT" || latest.type === "REFUND" ? "+" : "−";
    lastActivity = `${formatted} • ${typeLabels[latest.type]} ${sign}${latest.amount.toLocaleString("vi-VN")} ₫`;
  }

  const depositCount = depositsThisMonth.length;
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Số Dư Hiện Tại</CardTitle>
          <WalletIcon className="text-muted-foreground h-4 w-4" aria-hidden />
        </CardHeader>
        <CardContent>
          <div className="text-primary text-2xl font-bold">
            {formatShortCurrency(wallet.balance)}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">{lastActivity}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tổng Nạp Tháng Này
          </CardTitle>
          <CreditCard className="text-muted-foreground h-4 w-4" aria-hidden />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatShortCurrency(totalDepositCurrentMonth)}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            {depositCount > 0
              ? `Qua ${depositCount} lần nạp tiền`
              : "Chưa có giao dịch"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Chi Tiêu Tháng Này
          </CardTitle>
          <Zap className="text-muted-foreground h-4 w-4" aria-hidden />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatShortCurrency(totalSpentCurrentMonth)}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            {chargingSessionsCount > 0
              ? `Từ ${chargingSessionsCount} phiên sạc`
              : "Không có phiên sạc"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
