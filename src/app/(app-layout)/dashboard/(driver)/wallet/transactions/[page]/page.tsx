import TransactionTable from "@/features/wallet/components/wallet-transaction-table";
import { getUser } from "@/lib/auth/auth-server";
import SectionContent from "@/components/shared/section-content";
import {
  TransactionListApiSchema,
  WalletSchema,
} from "@/features/wallet/schemas/wallet.schema";
import { redirect } from "next/navigation";
import { getWallet } from "../../page";

const PAGE_SIZE = 10;

export async function getTransactions(
  page: number = 1,
  pageSize: number = PAGE_SIZE,
) {
  const { token } = await getUser();
  const url = `https://api.go-electrify.com/api/v1/wallet/me/transactions?page=${page}&pageSize=${pageSize}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    next: { tags: ["wallet-transactions"] },
  });

  if (!response.ok) {
    console.error("Failed to fetch transactions, status: " + response.status);
    return { transactions: [], total: 0, page: 1, pageSize };
  }

  const { success, data, error } = TransactionListApiSchema.safeParse(
    await response.json(),
  );

  if (!success) {
    console.error("Failed to parse transactions:", JSON.stringify(error));
    return { transactions: [], total: 0, page: 1, pageSize };
  }

  // For now, return all transactions and disable pagination
  return {
    transactions: data.data,
    total: data.total,
    page: 1,
    pageSize: data.data.length, // Show all on one page
  };
}

interface WalletPageProps {
  params: Promise<{ page: string }>;
}

export default async function WalletPage({ params }: WalletPageProps) {
  const { page: pageParam } = await params;
  const page = parseInt(pageParam, 10);

  // Validate page number
  if (isNaN(page) || page < 1) {
    redirect("/dashboard/wallet/page/1");
  }

  const wallet = await getWallet();
  const { transactions, total, pageSize } = await getTransactions(
    page,
    PAGE_SIZE,
  );

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
