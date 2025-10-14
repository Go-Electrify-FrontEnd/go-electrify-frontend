import { PenaltyTable } from "@/components/dashboard/wallet/wallet-penalty-table";
import TransactionTable from "@/components/dashboard/wallet/transaction-table";
import WalletDepositButton from "@/components/dashboard/wallet/wallet-deposit-button";
import { WalletOverview } from "@/components/dashboard/wallet/wallet-overview";
import { WalletSchema, TransactionListSchema } from "@/types/wallet";
import { getUser } from "@/lib/auth/auth-server";

async function getWallet() {
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

async function getTransactions(page: number = 1, pageSize: number = 20) {
  const { token } = await getUser();
  const url = `https://api.go-electrify.com/api/v1/wallet/me/transactions?page=${page}&pageSize=${pageSize}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30, tags: ["wallet-transactions"] },
  });

  if (!response.ok) {
    console.error("Failed to fetch transactions, status: " + response.status);
    return null;
  }

  const data = await response.json();
  const parsed = TransactionListSchema.safeParse(data);

  if (!parsed.success) {
    console.error("Failed to parse transactions:", parsed.error);
    return null;
  }

  return parsed.data;
}

export default async function WalletPage() {
  const [wallet, transactionsData] = await Promise.all([
    getWallet(),
    getTransactions(1, 10),
  ]);

  if (!wallet) {
    return <div>Đã xảy ra một số lỗi khi cố tải dữ liệu ví.</div>;
  }

  return (
    <div className="container mx-auto space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Ví
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Tiền gửi ví ảo của bạn và các giao dịch trước đó của bạn
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <WalletDepositButton />
        </div>
      </div>

      <WalletOverview wallet={wallet} />
      <PenaltyTable />
      <TransactionTable
        transactions={transactionsData?.data ?? []}
        totalCount={transactionsData?.total}
        showViewAll={true}
      />
    </div>
  );
}
