import SectionHeader from "@/components/section-header";
import { getUser } from "@/lib/auth/auth-server";
import SectionContent from "@/components/section-content";
import { ReportedIncidentTable } from "@/features/reported-incidents/components/reported-incident-table";
import { API_BASE_URL } from "@/lib/api-config";

export interface ReportedIncident {
  Id: number;
  ReporterName: string;
  StationId: number;
  StationName: string;
  ChargerId: number;
  ReporterUserId: number;
  Title: string;
  Severity: string;
  Status: string;
  ReportedAt: string;
  ResolvedAt: string | null;
}

export async function getReportedIncidents(
  token: string,
): Promise<ReportedIncident[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/incidents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["reported-incidents"] },
    });

    if (!response.ok) {
      console.log(
        "Failed to fetch reported incidents, status: " + response.status,
      );
      return [];
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error: unknown) {
    console.log("Error fetching reported incidents: " + JSON.stringify(error));
    return [];
  }
}

export default async function ReportedIncidentsPage() {
  const { token } = await getUser();
  const reportedIncidents = await getReportedIncidents(token!);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title={"Quản lý Sự Cố Báo Cáo"}
        subtitle={"Theo dõi và xử lý các sự cố được báo cáo từ người dùng"}
      />

      <SectionContent>
        <ReportedIncidentTable data={reportedIncidents} />
      </SectionContent>
    </div>
  );
}
