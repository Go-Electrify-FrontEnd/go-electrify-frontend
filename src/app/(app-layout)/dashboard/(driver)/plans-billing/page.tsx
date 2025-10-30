import { getSubscriptions } from "../../admin/subscriptions/page";
import type { Subscription } from "@/features/subscriptions/schemas/subscription.types";
import SectionHeader from "@/components/shared/section-header";
import SectionContent from "@/components/shared/section-content";
import { SubscriptionCard } from "@/features/subscriptions/components/subscription-card";

export default async function BillingPage() {
  const subscriptions = await getSubscriptions();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title="Gói Đăng Ký"
        subtitle="Chọn gói đăng ký phù hợp với nhu cầu sạc xe điện của bạn"
      />

      <SectionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      </SectionContent>
    </div>
  );
}
