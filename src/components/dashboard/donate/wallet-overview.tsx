import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp, Wallet, Zap } from "lucide-react";

export function WalletOverview() {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Số Dư Hiện Tại</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">2,847,500 đ</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +145,000 đ hôm nay
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tổng Nạp Tháng Này
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,200,000 đ</div>
          <p className="text-xs text-muted-foreground mt-1">
            Qua 8 lần nạp tiền
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Chi Tiêu Tháng Này
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">735,400 đ</div>
          <p className="text-xs text-muted-foreground mt-1">Từ 24 phiên sạc</p>
        </CardContent>
      </Card>
    </div>
  );
}
