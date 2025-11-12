import { getUser } from "@/lib/auth/auth-server";
import { AdminDashboardPage } from "@/features/dashboard/components/admin-dashboard-page";
import { DriverDashboardPage } from "@/features/dashboard/components/driver-dashboard-page";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const userRole = user.role.toLowerCase();
  if (userRole === "admin") {
    return <AdminDashboardPage />;
  }

  if (userRole === "staff") {
    redirect("/dashboard/staff/station-me");
  }

  return <DriverDashboardPage />;
}
