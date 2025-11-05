import { getUser } from "@/lib/auth/auth-server";
import { getChargingHistory } from "@/features/charging/services/session-service";
import { redirect } from "next/navigation";
import { ChargingHistoryTable } from "@/features/charging/components/charging-history-table";
import SectionHeader from "@/components/shared/section-header";
import SectionContent from "@/components/shared/section-content";

type SearchParams = Promise<{
  page?: string;
}>;

type ChargingHistoryPageProps = {
  searchParams: SearchParams;
};

export default async function ChargingHistoryPage({
  searchParams,
}: ChargingHistoryPageProps) {
  const { user, token } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 20;

  const historyData = await getChargingHistory(token, currentPage, pageSize);

  if (!historyData || !historyData.ok) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <SectionHeader
          title="Lịch sử sạc"
          subtitle="Xem các phiên sạc và giao dịch trong quá khứ của bạn"
        />
        <SectionContent>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              Không thể tải lịch sử sạc. Vui lòng thử lại sau.
            </p>
          </div>
        </SectionContent>
      </div>
    );
  }

  const { items, total, page } = historyData.data;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title="Lịch sử sạc"
        subtitle="Xem các phiên sạc và giao dịch trong quá khứ của bạn"
      />

      <SectionContent>
        <ChargingHistoryTable
          data={items}
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
        />
      </SectionContent>
    </div>
  );
}
