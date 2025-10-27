import SubscriptionCreateDialog from "@/features/subscriptions/components/subscription-create-dialog";
import SectionHeader from "@/components/shared/section-header";
import { SubscriptionsTable } from "@/features/subscriptions/components/subscription-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionSchema } from "@/lib/zod/subscription/subscription.schema";
import type { Subscription } from "@/lib/zod/subscription/subscription.types";
import SectionContent from "@/components/shared/section-content";

export async function getSubscriptions(): Promise<Subscription[]> {
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
      <SectionHeader
        title={"Quản lý Gói Đăng Ký"}
        subtitle={
          "Quản lý và theo dõi các gói đăng ký sạc xe điện một cách hiệu quả"
        }
      >
        <SubscriptionCreateDialog />
      </SectionHeader>

      <SectionContent>
        <Card>
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
      </SectionContent>
    </div>
  );
}
