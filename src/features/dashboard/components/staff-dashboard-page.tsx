import { getUser } from "@/lib/auth/auth-server";
import type { StaffStats } from "@/types/dashboard-stats";
import { redirect } from "next/navigation";
import { getStations } from "@/app/(app-layout)/dashboard/(admin-layout)/admin/stations/page";
import { StaffDashboard } from "@/features/dashboard/components/home/staff-dashboard";

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

export async function StaffDashboardPage() {
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }

  const stats = await buildStaffStats(token);
  return <StaffDashboard user={user} token={token} stats={stats} />;
}
