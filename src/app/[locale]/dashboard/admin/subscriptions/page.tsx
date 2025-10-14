import SubscriptionCreateDialog from "@/components/dashboard/admin/subscriptions/subscription-create-dialog";
import { SubscriptionsTable } from "@/components/dashboard/admin/subscriptions/subscription-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Subscription, SubscriptionSchema } from "@/types/subscription";

async function getSubscriptions(): Promise<Subscription[]> {
  const url = "https://api.go-electrify.com/api/v1/subscriptions";
  const response = await fetch(url, {
    method: "GET",
    next: { revalidate: 60, tags: ["subscriptions"] },
  });

  if (!response.ok) {
    console.error("Failed to fetch subscriptions, status: " + response.status);
    return [];
  }

  const parsed = SubscriptionSchema.array().safeParse(await response.json());
  if (!parsed.success) {
    console.error("Failed to parse subscriptions:", parsed.error);
    return [];
  }

  return parsed.data;
}

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader className="pt-8 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                <div className="space-y-1.5">
                  <CardTitle className="text-foreground text-4xl font-semibold">
                    Quản lý Gói Đăng Ký
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/90 text-base font-medium">
                    Quản lý và theo dõi các gói đăng ký sạc xe điện một cách
                    hiệu quả
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <SubscriptionCreateDialog />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="dark:bg-card/50 overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Danh sách gói đăng ký</CardTitle>
          <CardDescription>
            Tất cả các gói đăng ký trong hệ thống với thông tin chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionsTable data={subscriptions} />
        </CardContent>
      </Card>
    </div>
  );
}
