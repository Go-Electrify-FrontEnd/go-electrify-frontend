import { getUser } from "@/lib/auth/auth-server";
import { AdminDashboardPage } from "@/features/dashboard/components/admin-dashboard-page";
import { DriverDashboardPage } from "@/features/dashboard/components/driver-dashboard-page";
import { permanentRedirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = await getUser();

  if (!user) {
    permanentRedirect("/login");
  }

  const userRole = user.role.toLowerCase();

  if (userRole === "admin") {
    return <AdminDashboardPage />;
  }

  if (userRole === "staff") {
    permanentRedirect("/dashboard/staff/station-me");
  }

  return <DriverDashboardPage />;
}
