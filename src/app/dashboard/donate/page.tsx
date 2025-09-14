import { TransactionTable } from "@/components/dashboard/donate/transasction-table";
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard, Plus } from "lucide-react";
import { PenaltyTable } from "@/components/dashboard/donate/penalty-table";
import { WalletOverview } from "@/components/dashboard/donate/wallet-overview";

export default async function DonatePage() {
  return (
    <div className="space-y-4 sm:space-y-6 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Ví Điện Tử
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quản lý số dư và lịch sử giao dịch của bạn
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nạp Tiền
          </Button>
        </div>
      </div>

      <WalletOverview />
      <PenaltyTable />
      <TransactionTable />
    </div>
  );
}
