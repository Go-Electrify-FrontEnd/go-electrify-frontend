import { getUser } from "@/lib/auth/auth-server";
import type { DriverStats } from "@/features/dashboard/types/dashboard-stats";
import { redirect } from "next/navigation";
import { DriverDashboard } from "@/features/dashboard/components/home/driver-dashboard";
import { TransactionListApiSchema } from "@/features/wallet/schemas/wallet.schema";
import { getWallet } from "@/app/(app-layout)/dashboard/(driver)/wallet/page";
import { API_BASE_URL } from "@/lib/api-config";

async function getTransactions() {
  const { token } = await getUser();
  const url = `${API_BASE_URL}/wallet/me/transactions?page=1&pageSize=50`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.error("Failed to fetch transactions, status: " + response.status);
    return null;
  }

  const { success, data } = TransactionListApiSchema.safeParse(
    await response.json(),
  );

  return success ? data : null;
}

async function buildDriverData() {
  const [wallet, transactions] = await Promise.all([
    getWallet(),
    getTransactions(),
  ]);

  const driverStats: DriverStats = {
    walletBalance: wallet?.balance ?? 0,
    totalSpent: 0,
    chargingSessions: 0,
    upcomingReservations: 0,
  };

  return { driverStats, transactions };
}

export async function DriverDashboardPage() {
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }

  const { driverStats, transactions } = await buildDriverData();

  return (
    <DriverDashboard
      user={user}
      transactions={transactions}
      stats={driverStats}
    />
  );
}
