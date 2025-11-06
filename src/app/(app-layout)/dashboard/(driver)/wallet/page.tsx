import TransactionTable from "@/features/wallet/components/wallet-transaction-table";
import WalletDepositButton from "@/features/wallet/components/wallet-deposit-button";
import { WalletOverview } from "@/features/wallet/components/wallet-overview";
import { getUser } from "@/lib/auth/auth-server";
import SectionHeader from "@/components/section-header";
import SectionContent from "@/components/section-content";
import Link from "next/link";
import { WalletSchema } from "@/features/wallet/schemas/wallet.schema";
import { buttonVariants } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api-config";
import { getTransactions } from "@/features/wallet/api/wallet-api";

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
