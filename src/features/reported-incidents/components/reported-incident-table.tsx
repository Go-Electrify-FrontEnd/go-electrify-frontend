"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { IncidentDetailsModal } from "./incident-details-modal";

interface ReportedIncident {
  Id: number;
  StationId: number;
  StationName: string;
  ReporterName: string;
  ChargerId: number;
  ReporterUserId: number;
  Title: string;
  Severity: string;
  Status: string;
  ReportedAt: string;
  ResolvedAt: string | null;
  Description?: string;
  Note?: string;
}

interface ReportedIncidentTableProps {
  data: ReportedIncident[];
}

const getSeverityBadge = (severity: string) => {
  const severityMap: Record<
    string,
    {
      variant: "default" | "destructive" | "secondary" | "outline";
      label: string;
    }
  > = {
    HIGH: { variant: "destructive", label: "Nghiêm trọng" },
    MEDIUM: { variant: "default", label: "Trung bình" },
    LOW: { variant: "secondary", label: "Thấp" },
  };

  const config = severityMap[severity] || {
    variant: "outline" as const,
    label: severity,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<
    string,
    {
      variant: "default" | "destructive" | "secondary" | "outline";
      label: string;
      icon: React.ReactNode;
    }
  > = {
    OPEN: {
      variant: "outline",
      label: "Đang mở",
      icon: <AlertCircle className="mr-1 h-3 w-3" />,
    },
    IN_PROGRESS: {
      variant: "default",
      label: "Đang xử lý",
      icon: <Clock className="mr-1 h-3 w-3" />,
    },
    RESOLVED: {
      variant: "secondary",
      label: "Đã giải quyết",
      icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
    },
    CLOSED: {
      // Thêm trạng thái "CLOSED"
      variant: "destructive",
      label: "Đã đóng",
      icon: <XCircle className="mr-1 h-3 w-3" />,
    },
  };

  const config = statusMap[status] || {
    variant: "outline" as const,
    label: status,
    icon: null,
  };

  return (
    <Badge variant={config.variant} className="flex w-fit items-center">
      {config.icon}
      {config.label}
    </Badge>
  );
};

export function ReportedIncidentTable({ data }: ReportedIncidentTableProps) {
  const [incidents, setIncidents] = useState(data);
  const [selectedIncident, setSelectedIncident] =
    useState<ReportedIncident | null>(null);

  useEffect(() => {
    setIncidents(data);
  }, [data]);

  const handleUpdateSuccess = (updatedIncident: ReportedIncident) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.Id === updatedIncident.Id ? updatedIncident : inc,
      ),
    );
    setSelectedIncident(null);
  };

  if (!incidents || incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
        <p className="text-muted-foreground text-lg font-medium">
          Không có sự cố nào được báo cáo
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          Danh sách sự cố báo cáo sẽ hiển thị ở đây
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Trạm sạc</TableHead>
              <TableHead>Cổng sạc</TableHead>
              <TableHead>Mức độ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày báo cáo</TableHead>
              <TableHead>Ngày giải quyết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow
                key={incident.Id}
                onClick={() => setSelectedIncident(incident)}
                className="hover:bg-muted/50 cursor-pointer"
              >
                <TableCell className="font-medium">#{incident.Id}</TableCell>
                <TableCell className="max-w-[300px] font-medium">
                  {incident.Title}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{incident.StationName}</span>
                    <span className="text-muted-foreground text-xs">
                      ID: {incident.StationId}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Cổng #{incident.ChargerId}</Badge>
                </TableCell>
                <TableCell>{getSeverityBadge(incident.Severity)}</TableCell>
                <TableCell>{getStatusBadge(incident.Status)}</TableCell>
                <TableCell>
                  <span className="text-sm">
                    {format(new Date(incident.ReportedAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  {incident.ResolvedAt ? (
                    <span className="text-sm">
                      {format(
                        new Date(incident.ResolvedAt),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: vi,
                        },
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Chưa giải quyết
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <IncidentDetailsModal
        incident={selectedIncident}
        onOpenChange={() => setSelectedIncident(null)} // Đóng modal
        onUpdateSuccess={handleUpdateSuccess}
      />
    </>
  );
}
