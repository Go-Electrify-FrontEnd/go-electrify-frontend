import { getUser } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { getSubscriptions } from "@/app/(app-layout)/dashboard/admin/subscriptions/page";
import { AdminDashboard } from "@/features/dashboard/components/home/admin-dashboard";
import { getStations } from "@/features/stations/services/stations-api";
import { getUsers } from "@/features/users/services/users-api";
import { getConnectorTypes } from "@/features/connector-type/services/connector-type-api";
import { getVehicleModels } from "@/features/vehicle-models/services/vehicle-model-api";
import { getReportedIncidents } from "@/app/(app-layout)/dashboard/admin/incident-reports/page";

export async function AdminDashboardPage() {
  const { user, token } = await getUser();

  if (!user || !token) {
    redirect("/login");
  }

  const [
    stations,
    connectors,
    carModels,
    subscriptions,
    users,
    reportedIncidents,
  ] = await Promise.all([
    getStations(),
    getConnectorTypes(),
    getVehicleModels(token),
    getSubscriptions(),
    getUsers(),
    getReportedIncidents(token),
  ]);

  return (
    <AdminDashboard
      carModels={carModels}
      stations={stations}
      subscriptions={subscriptions}
      connectorTypes={connectors}
      users={users}
      reportedIncidents={reportedIncidents}
    />
  );
}
