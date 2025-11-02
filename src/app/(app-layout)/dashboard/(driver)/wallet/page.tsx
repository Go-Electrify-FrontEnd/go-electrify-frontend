import TransactionTable from "@/features/wallet/components/wallet-transaction-table";
import WalletDepositButton from "@/features/wallet/components/wallet-deposit-button";
import { WalletOverview } from "@/features/wallet/components/wallet-overview";
import { getUser } from "@/lib/auth/auth-server";
import SectionHeader from "@/components/shared/section-header";
import SectionContent from "@/components/shared/section-content";
import Link from "next/link";
import {
  TransactionListApiSchema,
  WalletSchema,
} from "@/features/wallet/schemas/wallet.schema";
import { Button, buttonVariants } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api-config";

export async function getWallet() {
  const { token } = await getUser();
  const url = `${API_BASE_URL}/wallet/me/balance`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    next: { tags: ["wallet-balance"] },
  });
  if (!response.ok) {
    console.error("Failed to fetch wallet, status: " + response.status);
    return null;
  }
  const { success, data } = WalletSchema.safeParse(await response.json());
  const wallet = success ? data : null;
  return wallet;
}

export async function getTransactions(page: number = 1, limit: number = 50) {
  const { token } = await getUser();
  const url = `${API_BASE_URL}/wallet/me/transactions?page=${page}&pageSize=${limit}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    next: { tags: ["wallet-transactions"] },
  });

  if (!response.ok) {
    console.error("Failed to fetch transactions, status: " + response.status);
    return { transactions: [], total: 0 };
  }

  const { success, data, error } = TransactionListApiSchema.safeParse(
    await response.json(),
  );

  if (!success) {
    console.error("Failed to parse transactions:", JSON.stringify(error));
    return { transactions: [], total: 0 };
  }

  return {
    transactions: data.data,
    total: data.total,
  };
}

export default async function WalletPage() {
  const wallet = await getWallet();
  const { transactions, total } = await getTransactions(1, 10);

  if (!wallet) {
    return <div>Đã xảy ra một số lỗi khi cố tải dữ liệu ví.</div>;
  }

  return (
    <div>
      <SectionHeader
        title="Ví của tôi"
        subtitle="Quản lý số dư và giao dịch của bạn"
      >
        <div className="flex gap-2">
          <WalletDepositButton />
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/dashboard/wallet/transactions/1"
            prefetch={false}
          >
            Xem tất cả giao dịch
          </Link>
        </div>
      </SectionHeader>

      <SectionContent className="mt-8 flex flex-col gap-4 md:gap-6">
        <WalletOverview wallet={wallet} transactions={transactions} />
        <TransactionTable
          transactions={transactions}
          totalCount={total}
          showViewAll={true}
        />
      </SectionContent>
    </div>
  );
}
