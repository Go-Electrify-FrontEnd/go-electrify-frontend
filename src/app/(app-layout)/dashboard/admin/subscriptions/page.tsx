import SubscriptionCreateDialog from "@/features/subscriptions/components/subscription-create-dialog";
import SectionHeader from "@/components/shared/section-header";
import { SubscriptionsTable } from "@/features/subscriptions/components/subscription-table";
import { SubscriptionSchema } from "@/features/subscriptions/schemas/subscription.schema";
import type { Subscription } from "@/features/subscriptions/schemas/subscription.types";
import SectionContent from "@/components/shared/section-content";
import { API_BASE_URL } from "@/lib/api-config";

export async function getSubscriptions(): Promise<Subscription[]> {
  const url = `${API_BASE_URL}/subscriptions`;
  const response = await fetch(url, {
    method: "GET",
    next: { tags: ["subscriptions"] },
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
        <SubscriptionsTable data={subscriptions} />
      </SectionContent>
    </div>
  );
}
