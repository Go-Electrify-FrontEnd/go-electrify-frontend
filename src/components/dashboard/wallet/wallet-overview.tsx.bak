"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction, Wallet } from "@/lib/zod/wallet/wallet.types";
import { CreditCard, WalletIcon, Zap } from "lucide-react";
import { useMemo } from "react";

interface WalletOverviewProps {
  wallet: Wallet;
  transactions: Transaction[];
}

export function WalletOverview({ wallet, transactions }: WalletOverviewProps) {
  const {
    totalDepositCurrentMonth,
    depositCount,
    totalSpentCurrentMonth,
    chargingSessionsCount,
    lastActivity,
  } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const toDate = (value: Date | string) =>
      value instanceof Date ? value : new Date(String(value));

    const depositsThisMonth = transactions.filter((transaction) => {
      const date = toDate(transaction.createdAt as Date | string);
      return (
        transaction.type === "DEPOSIT" &&
        transaction.status === "SUCCEEDED" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });

    const totalDeposit = depositsThisMonth.reduce(
      (sum, t) => sum + t.amount,
      0,
    );

    const chargesThisMonth = transactions.filter((transaction) => {
      const date = toDate(transaction.createdAt as Date | string);
      return (
        transaction.type === "CHARGE" &&
        transaction.status === "SUCCEEDED" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });

    const totalSpent = chargesThisMonth.reduce((sum, t) => sum + t.amount, 0);

    const chargingSessionIds = new Set<number>();
    chargesThisMonth.forEach((t) => {
      if (typeof t.chargingSession === "number") {
        chargingSessionIds.add(t.chargingSession);
      }
    });

    const chargingSessions =
      chargingSessionIds.size > 0
        ? chargingSessionIds.size
        : chargesThisMonth.length;

    // Determine last transaction (by createdAt) and render a short summary
    let lastActivityText = "Chưa có giao dịch";
    if (transactions.length > 0) {
      const latest = transactions.reduce((prev, curr) => {
        const pd = toDate(prev.createdAt as Date | string);
        const cd = toDate(curr.createdAt as Date | string);
        return cd > pd ? curr : prev;
      });
      const latestDate = toDate(latest.createdAt as Date | string);
      const formatted = new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(latestDate);
      const sign =
        latest.type === "DEPOSIT" || latest.type === "REFUND" ? "+" : "−";
      const typeLabelMap: Record<Transaction["type"], string> = {
        DEPOSIT: "Nạp tiền",
        WITHDRAW: "Rút tiền",
        CHARGE: "Sạc",
        REFUND: "Hoàn tiền",
      };
      lastActivityText = `${formatted} • ${typeLabelMap[latest.type]} ${sign}${latest.amount.toLocaleString("vi-VN")} ₫`;
    }

    return {
      totalDepositCurrentMonth: totalDeposit,
      depositCount: depositsThisMonth.length,
      totalSpentCurrentMonth: totalSpent,
      chargingSessionsCount: chargingSessions,
      lastActivity: lastActivityText,
    };
  }, [transactions]);

  const formatCurrency = (value: number) =>
    `${value.toLocaleString("vi-VN")} ₫`;

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Số Dư Hiện Tại</CardTitle>
          <WalletIcon className="text-muted-foreground h-4 w-4" aria-hidden />
        </CardHeader>
        <CardContent>
          <div className="text-primary text-2xl font-bold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(wallet.balance)}
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
            {formatCurrency(totalDepositCurrentMonth)}
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
            {formatCurrency(totalSpentCurrentMonth)}
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
