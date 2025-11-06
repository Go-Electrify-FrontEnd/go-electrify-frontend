import TransactionTable from "@/features/wallet/components/wallet-transaction-table";
import SectionContent from "@/components/section-content";
import { redirect } from "next/navigation";
import { getWallet } from "../../page";
import { getTransactions } from "@/features/wallet/api/wallet-api";

interface WalletPageProps {
  params: Promise<{ page: string }>;
}

export default async function TransactionsPage({ params }: WalletPageProps) {
  const { page: pageParam } = await params;
  const page = parseInt(pageParam, 10);

  // Validate page number
  if (isNaN(page) || page < 1) {
    redirect("/dashboard/wallet/page/1");
  }

  const wallet = await getWallet();
  const { transactions, total, pageSize } = await getTransactions(page);

  const totalPages = Math.ceil(total / pageSize);
  if (page > totalPages && totalPages > 0) {
    redirect(`/dashboard/wallet/page/${totalPages}`);
  }

  if (!wallet) {
    return <div>Đã xảy ra một số lỗi khi cố tải dữ liệu ví.</div>;
  }

  return (
    <div>
      <SectionContent className="mt-8 flex flex-col gap-4 md:gap-6">
        <TransactionTable
          transactions={transactions}
          totalCount={total}
          currentPage={page}
          pageSize={pageSize}
        />
      </SectionContent>
    </div>
  );
}
