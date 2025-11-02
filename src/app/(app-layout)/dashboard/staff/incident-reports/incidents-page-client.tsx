"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { ReportIncidentModal } from "./report-incident-modal";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { UpdateIncidentModal } from "./update-incident-modal";

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

interface IncidentsPageClientProps {
  initialIncidents: Incident[];
  stations: Station[];
}

function getStatusVariant(
  status: Incident["Status"],
): "destructive" | "default" | "secondary" | "outline" {
  switch (status) {
    case "OPEN":
      return "destructive";
    case "IN_PROGRESS":
      return "default";
    case "RESOLVED":
      return "secondary";
    case "CLOSED":
      return "outline";
    default:
      return "outline";
  }
}

function getStatusIcon(status: Incident["Status"]) {
  switch (status) {
    case "OPEN":
      return <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />;
    case "IN_PROGRESS":
      return <Wrench className="mr-2 h-4 w-4 text-blue-500" />;
    case "RESOLVED":
      return <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />;
    case "CLOSED":
      return <CheckCircle className="mr-2 h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
}

function getSeverityVariant(
  severity: Incident["Severity"],
): "destructive" | "default" | "secondary" {
  switch (severity) {
    case "HIGH":
      return "destructive";
    case "MEDIUM":
      return "default";
    case "LOW":
      return "secondary";
    default:
      return "secondary";
  }
}

export function IncidentsPageClient({
  initialIncidents,
  stations,
}: IncidentsPageClientProps) {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );

  const handleReportSuccess = (newIncident: Incident) => {
    setIncidents((prev) => [newIncident, ...prev]);
    setIsReportModalOpen(false);
  };

  const handleUpdateSuccess = (updatedIncident: Incident) => {
    // Cập nhật lại danh sách local (optimistic update)
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.Id === updatedIncident.Id ? updatedIncident : inc,
      ),
    );
    setSelectedIncident(null); // Đóng modal
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Báo Cáo Sự Cố</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Báo cáo mới
        </Button>
      </div>

      <div className="space-y-4">
        {incidents.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <ShieldCheck className="text-muted-foreground/50 mb-4 h-16 w-16" />
                <h3 className="mb-2 text-xl font-semibold">Tuyệt vời!</h3>
                <p className="text-muted-foreground">
                  Không có sự cố nào được báo cáo.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          incidents.map((incident) => (
            // === THÊM onClick VÀ CSS CURSOR ===
            <Card
              key={incident.Id}
              onClick={() => setSelectedIncident(incident)}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="mb-2">{incident.Title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(incident.Status)}>
                        {getStatusIcon(incident.Status)}
                        {incident.Status}
                      </Badge>
                      <Badge variant={getSeverityVariant(incident.Severity)}>
                        {incident.Severity}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {formatDistanceToNow(new Date(incident.ReportedAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{incident.Description}</p>
                <div className="text-muted-foreground mt-4 text-xs">
                  <p>
                    Trạm:{" "}
                    {stations.find((s) => s.Id === incident.StationId)?.Name ||
                      `Trạm #${incident.StationId}`}
                  </p>
                  <p>Bộ sạc: #{incident.ChargerId}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ReportIncidentModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        stations={stations}
        onReportSuccess={handleReportSuccess}
      />

      <UpdateIncidentModal
        incident={selectedIncident}
        onOpenChange={() => setSelectedIncident(null)}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
