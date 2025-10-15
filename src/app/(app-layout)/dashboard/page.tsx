import { AdminDashboard } from "@/components/dashboard/home/admin-dashboard";
import { DriverDashboard } from "@/components/dashboard/home/driver-dashboard";
import { StaffDashboard } from "@/components/dashboard/home/staff-dashboard";
import { getUser } from "@/lib/auth/auth-server";
import type {
  DriverStats,
  StaffStats,
  AdminStats,
} from "@/types/dashboard-stats";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }

  // Normalize role to lowercase for comparison
  const userRole = user.role?.toLowerCase();

  // Render appropriate dashboard based on user role; fetch stats on server and pass to components
  if (userRole === "admin") {
    // Parallelize heavy fetches for admin
    const [
      stationsRes,
      usersRes,
      connectorRes,
      vehicleRes,
      subsRes,
      reservationsRes,
    ] = await Promise.all([
      fetch("https://api.go-electrify.com/api/v1/stations", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["stations"] },
      }),
      fetch("https://api.go-electrify.com/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["users"] },
      }),
      fetch("https://api.go-electrify.com/api/v1/connector-types", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["connector-types"] },
      }),
      fetch("https://api.go-electrify.com/api/v1/vehicle-models", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["vehicle-models"] },
      }),
      fetch("https://api.go-electrify.com/api/v1/subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["subscriptions"] },
      }),
      fetch("https://api.go-electrify.com/api/v1/reservations", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["reservations"] },
      }),
    ]);

    let totalStations = 0;
    let activeStations = 0;
    if (stationsRes.ok) {
      const stationsData = await stationsRes.json();
      const stations = stationsData.Items || [];
      totalStations = stations.length;
      activeStations = stations.filter(
        (s: { Status?: string; IsActive?: boolean }) =>
          s.Status === "ACTIVE" || s.IsActive,
      ).length;
    }

    let totalUsers = 0;
    const roleBreakdown = { driver: 0, staff: 0, admin: 0 };
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      const users = usersData.Items || [];
      totalUsers = users.length;
      users.forEach((u: { Role?: string }) => {
        const role = (u.Role || "").toLowerCase();
        if (role === "driver" || role === "customer" || role === "user")
          roleBreakdown.driver++;
        else if (role === "staff") roleBreakdown.staff++;
        else if (role === "admin") roleBreakdown.admin++;
      });
    }

    let totalConnectorTypes = 0;
    if (connectorRes.ok) {
      const data = await connectorRes.json();
      totalConnectorTypes = (data.Items || []).length;
    }

    let totalVehicleModels = 0;
    if (vehicleRes.ok) {
      const data = await vehicleRes.json();
      totalVehicleModels = (data.Items || []).length;
    }

    let totalSubscriptions = 0;
    if (subsRes.ok) {
      const data = await subsRes.json();
      totalSubscriptions = (data.Items || []).length;
    }

    let totalReservations = 0;
    let activeReservations = 0;
    if (reservationsRes.ok) {
      const data = await reservationsRes.json();
      const reservations = data.Items || [];
      totalReservations = reservations.length;
      const now = new Date();
      activeReservations = reservations.filter(
        (r: { ScheduledStart?: string; ScheduledEnd?: string }) => {
          const scheduledStart = new Date(r.ScheduledStart || "");
          const scheduledEnd = new Date(r.ScheduledEnd || "");
          return now >= scheduledStart && now <= scheduledEnd;
        },
      ).length;
    }

    const adminStats: AdminStats = {
      totalStations,
      activeStations,
      totalUsers,
      roleBreakdown,
      totalConnectorTypes,
      totalVehicleModels,
      totalSubscriptions,
      totalReservations,
      activeReservations,
    };

    return <AdminDashboard user={user} token={token} stats={adminStats} />;
  }

  if (userRole === "staff") {
    const [stationsRes, usersRes, reservationsRes] = await Promise.all([
      fetch("https://api.go-electrify.com/api/v1/stations", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["stations"] },
      }),
      fetch("https://api.go-electrify.com/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["users"] },
      }),
      fetch("https://api.go-electrify.com/api/v1/reservations", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["reservations"] },
      }),
    ]);

    let totalStations = 0;
    let activeStations = 0;
    if (stationsRes.ok) {
      const stationsData = await stationsRes.json();
      const stations = stationsData.Items || [];
      totalStations = stations.length;
      activeStations = stations.filter(
        (s: { Status?: string; IsActive?: boolean }) =>
          s.Status === "ACTIVE" || s.IsActive,
      ).length;
    }

    let totalCustomers = 0;
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      const users = usersData.Items || [];
      totalCustomers = users.filter((u: { Role?: string }) => {
        const role = (u.Role || "").toLowerCase();
        return role === "driver" || role === "customer" || role === "user";
      }).length;
    }

    let activeSessions = 0;
    let pendingReservations = 0;
    if (reservationsRes.ok) {
      const reservationsData = await reservationsRes.json();
      const reservations = reservationsData.Items || [];
      const now = new Date();
      reservations.forEach(
        (r: { ScheduledStart?: string; ScheduledEnd?: string }) => {
          const scheduledStart = new Date(r.ScheduledStart || "");
          const scheduledEnd = new Date(r.ScheduledEnd || "");
          if (now >= scheduledStart && now <= scheduledEnd) activeSessions++;
          if (scheduledStart > now) pendingReservations++;
        },
      );
    }

    const staffStats: StaffStats = {
      totalStations,
      activeStations,
      totalCustomers,
      activeSessions,
      pendingReservations,
    };

    return <StaffDashboard user={user} token={token} stats={staffStats} />;
  }

  // Default to driver dashboard for "driver" role or any other role
  const [walletRes, transactionsRes, reservationsRes] = await Promise.all([
    fetch("https://api.go-electrify.com/api/v1/wallet/me/balance", {
      headers: { Authorization: `Bearer ${token}` },
      next: { tags: ["wallet"] },
    }),
    fetch(
      "https://api.go-electrify.com/api/v1/wallet/me/transactions?page=1&pageSize=100",
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["transactions"] },
      },
    ),
    fetch("https://api.go-electrify.com/api/v1/reservations/me", {
      headers: { Authorization: `Bearer ${token}` },
      next: { tags: ["reservations"] },
    }),
  ]);

  let walletBalance = 0;
  if (walletRes.ok) {
    const data = await walletRes.json();
    walletBalance = data.Balance || 0;
  }

  let totalSpent = 0;
  let chargingSessions = 0;
  if (transactionsRes.ok) {
    const data = await transactionsRes.json();
    if (data.Items && Array.isArray(data.Items)) {
      totalSpent = data.Items.filter(
        (t: { Type?: string }) => t.Type === "WITHDRAW",
      ).reduce(
        (sum: number, t: { Amount?: number }) => sum + (t.Amount || 0),
        0,
      );
      chargingSessions = data.Items.filter(
        (t: { Type?: string }) => t.Type === "WITHDRAW",
      ).length;
    }
  }

  let upcomingReservations = 0;
  if (reservationsRes.ok) {
    const data = await reservationsRes.json();
    const reservations = data.Items || [];
    upcomingReservations = reservations.filter(
      (r: { ScheduledStart?: string }) => {
        const scheduledStart = new Date(r.ScheduledStart || "");
        return scheduledStart > new Date();
      },
    ).length;
  }

  const driverStats: DriverStats = {
    walletBalance,
    totalSpent,
    chargingSessions,
    upcomingReservations,
  };

  return <DriverDashboard user={user} token={token} stats={driverStats} />;
}
