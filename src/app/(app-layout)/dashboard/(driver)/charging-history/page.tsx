import { getUser } from "@/lib/auth/auth-server";
import { getChargingHistory } from "@/features/charging/services/session-service";
import { redirect } from "next/navigation";
import { ChargingHistoryTable } from "@/features/charging/components/charging-history-table";
import SectionHeader from "@/components/section-header";
import SectionContent from "@/components/section-content";

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

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 8;

  const historyData = await getChargingHistory(token!, currentPage, pageSize);

  if (!historyData || !historyData.ok) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        Không thể tải lịch sử sạc
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
