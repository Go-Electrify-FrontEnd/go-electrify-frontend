import TransactionTable from "@/features/wallet/components/wallet-transaction-table";
import WalletDepositButton from "@/features/wallet/components/wallet-deposit-button";
import { WalletOverview } from "@/features/wallet/components/wallet-overview";
import {
  WalletSchema,
  TransactionListApiSchema,
} from "@/lib/zod/wallet/wallet.schema";
import { getUser } from "@/lib/auth/auth-server";
import SectionHeader from "@/components/shared/section-header";
import SectionContent from "@/components/shared/section-content";

export async function getWallet() {
  const { token } = await getUser();
  const url = "https://api.go-electrify.com/api/v1/wallet/me/balance";
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    console.error("Failed to fetch wallet, status: " + response.status);
    return null;
  }
  const data = await response.json();
  const { success, data: wallet } = WalletSchema.safeParse(data);
  if (!success) {
    return null;
  }
  return wallet;
}

export async function getTransactions(page: number = 1, pageSize: number = 20) {
  const { token } = await getUser();
  const url = `https://api.go-electrify.com/api/v1/wallet/me/transactions?page=${page}&pageSize=${pageSize}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.error("Failed to fetch transactions, status: " + response.status);
    return null;
  }

  const data = await response.json();
  const parsedApi = TransactionListApiSchema.safeParse(data);

  if (parsedApi.success) {
    return parsedApi.data;
  }

  return null;
}

export default async function WalletPage() {
  const [wallet, transactionsData] = await Promise.all([
    getWallet(),
    getTransactions(),
  ]);

  if (!wallet) {
    return <div>Đã xảy ra một số lỗi khi cố tải dữ liệu ví.</div>;
  }

  const transactions = transactionsData?.data || [];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title="Ví của tôi"
        subtitle="Quản lý số dư và giao dịch của bạn"
      >
        <WalletDepositButton />
      </SectionHeader>

      <SectionContent className="flex flex-col gap-4 md:gap-6">
        <WalletOverview wallet={wallet} transactions={transactions} />
        <TransactionTable
          transactions={transactions}
          totalCount={transactions.length}
          showViewAll={true}
        />
      </SectionContent>
    </div>
  );
}
