import SubscriptionCreateDialog from "@/features/subscriptions/components/subscription-create-dialog";
import SectionHeader from "@/components/section-header";
import { SubscriptionsTable } from "@/features/subscriptions/components/subscription-table";
import SectionContent from "@/components/section-content";
import { getSubscriptions } from "@/features/subscriptions/api/subscriptions-api";

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
