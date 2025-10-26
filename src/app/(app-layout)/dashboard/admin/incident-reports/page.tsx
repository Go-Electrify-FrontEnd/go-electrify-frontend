import SectionHeader from "@/components/shared/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/auth-server";
import SectionContent from "@/components/shared/section-content";
import { ReportedIncidentTable } from "@/features/reported-incidents/components/reported-incident-table";

interface ReportedIncident {
  Id: number;
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
    const response = await fetch(
      "https://api.go-electrify.com/api/v1/admin/incidents",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60, tags: ["reported-incidents"] },
      },
    );

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
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Danh sách sự cố báo cáo</CardTitle>
            <CardDescription>
              Tất cả các sự cố được báo cáo trong hệ thống với thông tin chi
              tiết
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportedIncidentTable data={reportedIncidents} />
          </CardContent>
        </Card>
      </SectionContent>
    </div>
  );
}
