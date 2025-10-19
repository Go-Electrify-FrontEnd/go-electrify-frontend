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
import { getStations } from "./(admin-layout)/admin/stations/page";
import { getConnectorTypes } from "./(admin-layout)/admin/connector-type/page";
import { getVehicleModels } from "./(admin-layout)/admin/vehicle-models/page";
import { getSubscriptions } from "./(admin-layout)/admin/subscriptions/page";
import { getUsers } from "./(admin-layout)/admin/users/page";
import { getTransactions, getWallet } from "./wallet/page";

export default async function DashboardPage() {
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }

  const userRole = user.role?.toLowerCase();
  if (userRole === "admin") {
    const [reservationsRes] = await Promise.all([
      fetch("https://api.go-electrify.com/api/v1/reservations", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["reservations"] },
      }),
    ]);

    const stations = await getStations();
    let totalStations = 0;
    let activeStations = 0;
    if (stations) {
      totalStations = stations.length;
      activeStations = stations.filter((s) => s.status === "active").length;
    }

    const users = await getUsers();
    let totalUsers = 0;
    const roleBreakdown = { driver: 0, staff: 0, admin: 0, unknown: 0 };

    if (users) {
      totalUsers = users.length;

      users.forEach((user) => {
        const role = user.role?.toLowerCase() || "";
        if (role === "driver") roleBreakdown.driver++;
        else if (role === "staff") roleBreakdown.staff++;
        else if (role === "admin") roleBreakdown.admin++;
        else roleBreakdown.unknown++;
      });
    }

    const connectors = await getConnectorTypes();
    let totalConnectorTypes = 0;
    if (connectors) {
      totalConnectorTypes = connectors.length;
    }

    const vehicleModels = await getVehicleModels(token);
    let totalVehicleModels = 0;
    if (vehicleModels) {
      totalVehicleModels = vehicleModels.length;
    }

    const subscriptions = await getSubscriptions();
    let totalSubscriptions = 0;
    if (subscriptions) {
      totalSubscriptions = subscriptions.length;
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
    const [reservationsRes] = await Promise.all([
      fetch("https://api.go-electrify.com/api/v1/reservations", {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["reservations"] },
      }),
    ]);

    const stations = await getStations();
    let totalStations = 0;
    let activeStations = 0;
    if (stations) {
      totalStations = stations.length;
      activeStations = stations.filter((s) => s.status === "active").length;
    }

    const totalCustomers = 0;
    // if (usersRes.ok) {
    //   const usersData = await usersRes.json();
    //   const users = usersData.Items || [];
    //   totalCustomers = users.filter((u: { Role?: string }) => {
    //     const role = (u.Role || "").toLowerCase();
    //     return role === "driver" || role === "customer" || role === "user";
    //   }).length;
    // }

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
  const wallet = await getWallet();
  let walletBalance = 0;
  if (wallet) {
    walletBalance = wallet.balance;
  }

  const transactions = await getTransactions();
  let totalSpent = 0;
  const chargingSessions = 0;
  if (transactions) {
    totalSpent = transactions.data
      .filter((transaction) => transaction.type === "DEPOSIT")
      .reduce((sum, prev) => sum + prev.amount, 0);
  }

  const upcomingReservations = 0;
  const driverStats: DriverStats = {
    walletBalance,
    totalSpent,
    chargingSessions,
    upcomingReservations,
  };

  return <DriverDashboard user={user} token={token} stats={driverStats} />;
}
