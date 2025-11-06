import { getUser } from "@/lib/auth/auth-server";
import "server-only";
import { DriverStats } from "../types/dashboard-stats";
import { getWallet } from "@/app/(app-layout)/dashboard/(driver)/wallet/page";
import { getChargingHistory } from "@/features/charging/services/session-service";
import { getReservations } from "@/features/reservations/services/reservations-api";

/**
 * Fetch driver statistics for the dashboard
 * @returns Driver stats including wallet balance, spending, sessions, and reservations
 */
export async function getDriverStats(): Promise<DriverStats> {
  const { token } = await getUser();

  if (!token) {
    return {
      walletBalance: 0,
      totalSpent: 0,
      chargingSessions: 0,
      upcomingReservations: 0,
    };
  }

  try {
    // Fetch wallet balance using existing function
    const wallet = await getWallet();
    const walletBalance = wallet?.balance || 0;

    // Fetch charging sessions history to calculate stats using existing function
    const historyData = await getChargingHistory(token, 1, 100);

    let chargingSessions = 0;
    let totalSpent = 0;

    if (historyData?.ok && historyData.data) {
      chargingSessions = historyData.data.total || 0;
      // Calculate total spent from sessions
      if (Array.isArray(historyData.data.items)) {
        totalSpent = historyData.data.items.reduce((sum, session) => {
          return sum + (session.cost || 0);
        }, 0);
      }
    }

    // Fetch reservations using existing function
    const reservations = await getReservations(token);
    const upcomingReservations = reservations.filter(
      (r) => r.status?.toLowerCase() === "confirmed",
    ).length;

    return {
      walletBalance,
      totalSpent,
      chargingSessions,
      upcomingReservations,
    };
  } catch (error) {
    console.error("Error fetching driver stats:", error);
    return {
      walletBalance: 0,
      totalSpent: 0,
      chargingSessions: 0,
      upcomingReservations: 0,
    };
  }
}
