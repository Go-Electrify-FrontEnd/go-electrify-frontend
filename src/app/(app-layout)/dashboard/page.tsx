import { getUser } from "@/lib/auth/auth-server";
import { hasRole } from "@/lib/auth/role-check";
import { AdminDashboardPage } from "@/features/dashboard/components/admin-dashboard-page";
import { DriverDashboardPage } from "@/features/dashboard/components/driver-dashboard-page";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (hasRole(user, "admin")) {
    return <AdminDashboardPage />;
  }

  if (hasRole(user, "staff")) {
    redirect("/dashboard/staff/station-me");
  }

  return <DriverDashboardPage />;
}
