import { PenaltyTable } from "@/components/dashboard/wallet/penalty-table";
import TransactionTable from "../../../components/dashboard/wallet/transaction-table";
import WalletDepositButton from "@/components/dashboard/wallet/wallet-deposit-button";
import { WalletOverview } from "@/components/dashboard/wallet/wallet-overview";

export default async function DonatePage() {
  return (
    <div className="container mx-auto space-y-4">
      <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Ví Điện Tử
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Quản lý số dư và lịch sử giao dịch của bạn
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <WalletDepositButton />
        </div>
      </div>

      <WalletOverview />
      <PenaltyTable />
      <TransactionTable />
    </div>
  );
}
