import { getUser } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/features/dashboard/components/home/admin-dashboard";
import { getUsers } from "@/features/users/api/users-api";
import { getConnectorTypes } from "@/features/connector-type/services/connector-type-api";
import { getReportedIncidents } from "@/app/(app-layout)/dashboard/admin/incident-reports/page";
import { getSubscriptions } from "@/features/subscriptions/api/subscriptions-api";
import { getStations } from "@/features/stations/api/stations-api";

export async function AdminDashboardPage() {
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }
  const users = await getUsers();
  const stations = await getStations();
  const connectors = await getConnectorTypes();
  const subscriptions = await getSubscriptions();
  const reportedIncidents = await getReportedIncidents(token);

  return (
    <AdminDashboard
      stations={stations}
      subscriptions={subscriptions}
      connectorTypes={connectors}
      users={users}
      reportedIncidents={reportedIncidents}
    />
  );
}
