import { getUser } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { DriverDashboard } from "@/features/dashboard/components/home/driver-dashboard";
import { getDriverStats } from "@/features/dashboard/services/driver-stats-api";
import { getTransactions } from "@/features/wallet/api/wallet-api";

export async function DriverDashboardPage() {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const stats = await getDriverStats();
  const { transactions } = await getTransactions(1, 5);

  return <DriverDashboard user={user} transactions={transactions} stats={stats} />;
}
