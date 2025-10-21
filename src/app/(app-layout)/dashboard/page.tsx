import { getUser } from "@/lib/auth/auth-server";
import type {
  DriverStats,
  StaffStats,
  AdminStats,
} from "@/types/dashboard-stats";
import { redirect } from "next/navigation";
import { getStations } from "./(admin-layout)/admin/stations/page";
import { getConnectorTypes } from "./(admin-layout)/admin/connector-type/page";
import { getVehicleModels } from "./(admin-layout)/admin/vehicle-models/page";
import { getSubscriptions } from "./(admin-layout)/admin/subscriptions/page";
import { getUsers } from "./(admin-layout)/admin/users/page";
import { getTransactions, getWallet } from "./wallet/page";
import { DriverDashboard } from "@/features/dashboard/components/home/driver-dashboard";
import { StaffDashboard } from "@/features/dashboard/components/home/staff-dashboard";
import { AdminDashboard } from "@/features/dashboard/components/home/admin-dashboard";

type ReservationRecord = {
  ScheduledStart?: string | null;
  ScheduledEnd?: string | null;
};

type ReservationSummary = {
  active: number;
  upcoming: number;
};

async function fetchReservations(token: string): Promise<ReservationRecord[]> {
  return [];
}

function parseIsoDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function summarizeReservations(
  reservations: ReservationRecord[],
  now: Date,
): ReservationSummary {
  return reservations.reduce<ReservationSummary>(
    (acc, reservation) => {
      const start = parseIsoDate(reservation.ScheduledStart);
      const end = parseIsoDate(reservation.ScheduledEnd);

      if (start && end && now >= start && now <= end) {
        acc.active += 1;
      } else if (start && start > now) {
        acc.upcoming += 1;
      }

      return acc;
    },
    { active: 0, upcoming: 0 },
  );
}

function summarizeStations(
  stations: Array<{ status?: string }> | null | undefined,
) {
  const totalStations = stations?.length ?? 0;
  const activeStations =
    stations?.filter((station) => station.status === "ACTIVE").length ?? 0;
  return { totalStations, activeStations };
}

function summarizeUsers(
  users: Array<{ role?: string | null }> | null | undefined,
) {
  const roleBreakdown: AdminStats["roleBreakdown"] = {
    driver: 0,
    staff: 0,
    admin: 0,
  };

  let totalUsers = 0;
  let unknownCount = 0;

  if (Array.isArray(users)) {
    totalUsers = users.length;
    users.forEach((user) => {
      const normalized = user.role?.toLowerCase() ?? "unknown";
      if (
        normalized === "driver" ||
        normalized === "staff" ||
        normalized === "admin"
      ) {
        roleBreakdown[normalized] += 1;
        return;
      }
      unknownCount += 1;
    });
  }

  if (unknownCount > 0 && process.env.NODE_ENV !== "production") {
    console.warn(
      `[Dashboard] Encountered ${unknownCount} user(s) with unknown role during summary.`,
    );
  }

  return { totalUsers, roleBreakdown };
}

async function buildAdminStats(token: string): Promise<AdminStats> {
  const [
    stations,
    users,
    connectors,
    vehicleModels,
    subscriptions,
    reservations,
  ] = await Promise.all([
    getStations(),
    getUsers(),
    getConnectorTypes(),
    getVehicleModels(token),
    getSubscriptions(),
    fetchReservations(token),
  ]);

  const { totalStations, activeStations } = summarizeStations(stations);
  const { totalUsers, roleBreakdown } = summarizeUsers(users);
  const totalConnectorTypes = connectors?.length ?? 0;
  const totalVehicleModels = vehicleModels?.length ?? 0;
  const totalSubscriptions = subscriptions?.length ?? 0;
  const { active: activeReservations } = summarizeReservations(
    reservations,
    new Date(),
  );

  return {
    totalStations,
    activeStations,
    totalUsers,
    roleBreakdown,
    totalConnectorTypes,
    totalVehicleModels,
    totalSubscriptions,
    totalReservations: reservations.length,
    activeReservations,
  };
}

async function buildStaffStats(token: string): Promise<StaffStats> {
  const [stations, reservations] = await Promise.all([
    getStations(),
    fetchReservations(token),
  ]);

  const { totalStations, activeStations } = summarizeStations(stations);
  const { active: activeSessions, upcoming: pendingReservations } =
    summarizeReservations(reservations, new Date());

  return {
    totalStations,
    activeStations,
    totalCustomers: 0,
    activeSessions,
    pendingReservations,
  };
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

export default async function DashboardPage() {
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }

  const userRole = user.role?.toLowerCase();
  if (userRole === "admin") {
    const stats = await buildAdminStats(token);
    return <AdminDashboard user={user} token={token} stats={stats} />;
  }

  if (userRole === "staff") {
    const stats = await buildStaffStats(token);
    return <StaffDashboard user={user} token={token} stats={stats} />;
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
