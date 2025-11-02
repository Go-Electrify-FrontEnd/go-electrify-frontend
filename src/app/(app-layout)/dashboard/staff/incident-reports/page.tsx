import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";
import { IncidentsPageClient } from "./incidents-page-client";

interface Incident {
  Id: number;
  StationId: number;
  ChargerId: number;
  Title: string;
  Description: string;
  Severity: "HIGH" | "MEDIUM" | "LOW";
  Status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  ReportedAt: string;
}

interface Station {
  Id: number;
  Name: string;
  Address: string;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ApiStation {
  Id: number;
  Name: string;
  Address: string;
}

interface ApiIncident {
  Id: number;
  StationId: number;
  ChargerId: number;
  ReportedByStationStaffId: number;
  Title: string;
  Description: string;
  Severity: "HIGH" | "MEDIUM" | "LOW";
  Status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  ReportedAt: string;
}

// Hàm fetch trạm
async function getStations(token: string): Promise<ApiStation[]> {
  try {
    const res = await fetch("https://api.go-electrify.com/api/v1/stations/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return [data];
  } catch (error) {
    console.error("Failed to fetch stations:", error);
    return [];
  }
}

// Hàm fetch sự cố cho 1 trạm
async function getIncidentsForStation(
  stationId: number,
  token: string,
): Promise<ApiIncident[]> {
  try {
    const res = await fetch(
      `https://api.go-electrify.com/api/v1/stations/${stationId}/incidents`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch incidents for station ${stationId}:`, error);
    return [];
  }
}

export default async function IncidentsPage() {
  const { user, token } = await getUser();
  if (!user) {
    forbidden();
  }

  // 1. Fetch tất cả các trạm
  const stations = await getStations(token);

  // 2. Fetch song song tất cả sự cố từ các trạm đó
  const incidentPromises = stations.map((station) =>
    getIncidentsForStation(station.Id, token),
  );
  const incidentsPerStation = await Promise.all(incidentPromises);

  // 3. Gộp tất cả sự cố vào 1 mảng duy nhất và sắp xếp mới nhất lên đầu
  const allIncidents = incidentsPerStation
    .flat()
    .sort(
      (a, b) =>
        new Date(b.ReportedAt).getTime() - new Date(a.ReportedAt).getTime(),
    );

  // (Bạn nên tạo type chuẩn trong @/types/ thay vì map ở đây)
  // Đảm bảo props truyền đi khớp với type client
  const typedStations: Station[] = stations.map((s) => ({
    Id: s.Id,
    Name: s.Name,
    Address: s.Address,
  }));

  const typedIncidents: Incident[] = allIncidents.map((i) => ({
    Id: i.Id,
    StationId: i.StationId,
    ChargerId: i.ChargerId,
    Title: i.Title,
    Description: i.Description,
    Severity: i.Severity,
    Status: i.Status,
    ReportedAt: i.ReportedAt,
  }));

  return (
    <IncidentsPageClient
      initialIncidents={typedIncidents}
      stations={typedStations}
    />
  );
}
