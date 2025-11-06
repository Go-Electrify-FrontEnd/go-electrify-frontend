import SectionHeader from "@/components/section-header";
import SectionContent from "@/components/section-content";
import { SubscriptionCard } from "@/features/subscriptions/components/subscription-card";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Calendar, CheckCircle2, Package, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatShortCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { getUserSubscriptions } from "@/features/plans-billing/api/subscriptions-api";
import { getSubscriptions } from "@/features/subscriptions/api/subscriptions-api";

export default async function BillingPage() {
  const subscriptions = await getSubscriptions();
  const userSubscriptions = await getUserSubscriptions();

  const activeSubscriptions = userSubscriptions.filter(
    (sub) => sub.status === "ACTIVE",
  );
  const totalKwhRemaining = activeSubscriptions.reduce(
    (sum, sub) => sum + sub.remainingKwh,
    0,
  );
  const totalKwhPurchased = activeSubscriptions.reduce(
    (sum, sub) => sum + sub.totalKwh,
    0,
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title="Gói Đăng Ký & Thanh Toán"
        subtitle="Quản lý gói đăng ký và theo dõi sử dụng của bạn"
      />

      {/* User Subscriptions Section */}
      <SectionContent>
        {/* Stats Overview - Always visible */}
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card mb-6 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Gói Đang Hoạt Động</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {activeSubscriptions.length}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <CheckCircle2 className="size-4" />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Đang sử dụng <Package className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Tổng số gói đang hoạt động
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Điện Năng Còn Lại</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {totalKwhRemaining.toFixed(1)}
                <span className="text-muted-foreground ml-1 text-sm font-normal">
                  kWh
                </span>
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Battery className="size-4" />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Từ {totalKwhPurchased} kWh <Zap className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Tổng điện năng khả dụng
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Tỷ Lệ Sử Dụng</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {totalKwhPurchased > 0
                  ? Math.round(
                      ((totalKwhPurchased - totalKwhRemaining) /
                        totalKwhPurchased) *
                        100,
                    )
                  : 0}
                %
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Zap className="size-4" />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Đã sử dụng {(totalKwhPurchased - totalKwhRemaining).toFixed(1)}{" "}
                kWh <Battery className="size-4" />
              </div>
              <div className="text-muted-foreground">Hiệu suất sử dụng gói</div>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
              Gói Đăng Ký Của Bạn
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
              Theo dõi chi tiết các gói đăng ký đang sử dụng
            </CardDescription>
            {userSubscriptions.length > 0 && (
              <CardAction>
                <Badge variant="default" className="text-[10px] sm:text-xs">
                  {userSubscriptions.length} gói
                </Badge>
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            {userSubscriptions.length > 0 ? (
              <>
                {/* Active Subscriptions */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {userSubscriptions.map((subscription) => {
                    const usagePercent =
                      (subscription.remainingKwh / subscription.totalKwh) * 100;
                    const isActive = subscription.status === "ACTIVE";
                    const daysRemaining = Math.ceil(
                      (new Date(subscription.endDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24),
                    );

                    return (
                      <Card
                        key={subscription.id}
                        className="border-muted shadow-sm"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">
                              {subscription.subscriptionName}
                            </CardTitle>
                            <Badge
                              variant={isActive ? "default" : "secondary"}
                              className="text-[10px]"
                            >
                              {subscription.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            Gói {subscription.totalKwh} kWh -{" "}
                            {formatShortCurrency(subscription.price)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Điện năng còn lại
                              </span>
                              <span className="font-medium">
                                {subscription.remainingKwh.toFixed(1)} /{" "}
                                {subscription.totalKwh} kWh
                              </span>
                            </div>
                            <Progress value={usagePercent} className="h-2" />
                          </div>

                          <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {daysRemaining > 0
                                ? `Còn ${daysRemaining} ngày`
                                : "Đã hết hạn"}{" "}
                              • Hết hạn{" "}
                              {new Date(
                                subscription.endDate,
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Package className="text-muted-foreground h-12 w-12" />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có gói đăng ký</EmptyTitle>
                  <EmptyDescription>
                    Bạn chưa mua gói đăng ký nào. Hãy chọn gói phù hợp với nhu
                    cầu sạc xe điện của bạn.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button asChild>
                    <a href="#available-plans">Xem các gói có sẵn</a>
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </CardContent>
        </Card>
      </SectionContent>

      {/* Available Subscription Plans */}
      <SectionContent>
        <Card id="available-plans">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              Các Gói Đăng Ký Có Sẵn
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
              Chọn gói đăng ký phù hợp với nhu cầu sạc xe điện của bạn
            </CardDescription>
            <CardAction>
              <Badge variant="secondary" className="text-[10px] sm:text-xs">
                {subscriptions.length} gói khả dụng
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </SectionContent>
    </div>
  );
}
