"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "@/types/wallet";
import { CreditCard, TrendingUp, WalletIcon, Zap } from "lucide-react";
import { useFormatter } from "next-intl";

interface WalletOverviewProps {
  wallet: Wallet;
}

export function WalletOverview({ wallet }: WalletOverviewProps) {
  const formatter = useFormatter();
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Số Dư Hiện Tại</CardTitle>
          <WalletIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-primary text-2xl font-bold">
            {formatter.number(wallet.balance, {
              style: "currency",
              currency: "VND",
            })}
          </div>
          <p className="text-muted-foreground mt-1 text-xs"></p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tổng Nạp Tháng Này
          </CardTitle>
          <CreditCard className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,200,000 đ</div>
          <p className="text-muted-foreground mt-1 text-xs">
            Qua 8 lần nạp tiền
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Chi Tiêu Tháng Này
          </CardTitle>
          <Zap className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">735,400 đ</div>
          <p className="text-muted-foreground mt-1 text-xs">Từ 24 phiên sạc</p>
        </CardContent>
      </Card>
    </div>
  );
}
