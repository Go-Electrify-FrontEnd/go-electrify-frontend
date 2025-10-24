import { getUser } from "@/lib/auth/auth-server";
import { AdminDashboardPage } from "@/features/dashboard/components/admin-dashboard-page";
import { StaffDashboardPage } from "@/features/dashboard/components/staff-dashboard-page";
import { DriverDashboardPage } from "@/features/dashboard/components/driver-dashboard-page";

export default async function DashboardPage() {
  const { user } = await getUser();

  const userRole = user!.role.toLowerCase();
  if (userRole === "admin") {
    return <AdminDashboardPage />;
  }

  if (userRole === "staff") {
    return <StaffDashboardPage />;
  }

  return <DriverDashboardPage />;
}
