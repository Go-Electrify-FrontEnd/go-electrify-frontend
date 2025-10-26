import { getSelfStationId } from "@/features/stations/api/stations-api";
import { getUser } from "@/lib/auth/auth-server";
import { permanentRedirect } from "next/navigation";

export default async function StaffStationsPage() {
  const { token } = await getUser();

  const stationId = await getSelfStationId(token!);
  permanentRedirect("/dashboard/station-detail/" + stationId);
}
