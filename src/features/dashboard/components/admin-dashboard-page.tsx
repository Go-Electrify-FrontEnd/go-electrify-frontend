import { getUser } from "@/lib/auth/auth-server";
import type { AdminStats } from "@/types/dashboard-stats";
import { redirect } from "next/navigation";
import { getStations } from "@/app/(app-layout)/dashboard/(admin-layout)/admin/stations/page";
import { getConnectorTypes } from "@/app/(app-layout)/dashboard/(admin-layout)/admin/connector-type/page";
import { getVehicleModels } from "@/app/(app-layout)/dashboard/(admin-layout)/admin/vehicle-models/page";
import { getSubscriptions } from "@/app/(app-layout)/dashboard/(admin-layout)/admin/subscriptions/page";
import { getUsers } from "@/app/(app-layout)/dashboard/(admin-layout)/admin/users/page";
import { AdminDashboard } from "@/features/dashboard/components/home/admin-dashboard";

type ReservationRecord = {
  ScheduledStart?: string | null;
  ScheduledEnd?: string | null;
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
): { active: number; upcoming: number } {
  return reservations.reduce<{ active: number; upcoming: number }>(
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

export async function AdminDashboardPage() {
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }

  const stats = await buildAdminStats(token);
  return <AdminDashboard user={user} token={token} stats={stats} />;
}
