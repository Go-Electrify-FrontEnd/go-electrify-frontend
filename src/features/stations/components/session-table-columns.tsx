import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatDateTime } from "@/lib/formatters";
import { SessionActionsCell } from "@/features/stations/components/session-actions";

export type SessionRow = {
  id: number | string;
  chargerId: number;
  chargerCode?: string | null;
  bookingId: number | null;
  status: string;
  startedAt: string;
  initialSoc: number | null;
  targetSoc: number | null;
  chargerPowerKw: number | null;
  vehicleMaxPowerKw: number | null;
  vehicleBatteryCapacityKwh: number | null;
  connectorMaxPowerKw: number | null;
};

// Use shared formatters but preserve previous '-' output for null/undefined values
const formatWithSuffix = (value: number | null | undefined, suffix = "") => {
  if (value == null || Number.isNaN(Number(value))) return "-";
  return `${formatNumber(value)}${suffix}`;
};

const getStatusVariant = (
  status: string,
): "default" | "secondary" | "destructive" | "outline" => {
  const normalized = String(status).toUpperCase();

  switch (normalized) {
    case "PENDING":
      return "outline";
    case "RUNNING":
      return "default";
    case "COMPLETED":
      return "secondary";
    case "PAID":
      return "secondary";
    case "TIMEOUT":
      return "destructive";
    case "FAILED":
      return "destructive";
    case "ABORTED":
      return "destructive";
    case "UNPAID":
      return "outline";
    default:
      return "secondary";
  }
};

const getStatusLabel = (status: string): string => {
  const normalized = String(status).toUpperCase();

  switch (normalized) {
    case "PENDING":
      return "Chờ xử lý";
    case "RUNNING":
      return "Đang sạc";
    case "COMPLETED":
      return "Hoàn thành";
    case "TIMEOUT":
      return "Hết thời gian";
    case "FAILED":
      return "Thất bại";
    case "ABORTED":
      return "Đã hủy";
    case "UNPAID":
      return "Chưa thanh toán";
    case "PAID":
      return "Đã thanh toán";
    default:
      return status;
  }
};

export const sessionColumns: ColumnDef<SessionRow>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "chargerCode",
    header: "Dock",
    cell: ({ row }) => {
      const code = row.original.chargerCode;
      if (code) return <div className="font-medium">{code}</div>;
      return (
        <div className="text-muted-foreground">#{row.original.chargerId}</div>
      );
    },
  },
  {
    accessorKey: "bookingId",
    header: "Đơn giữ chỗ",
    cell: ({ row }) => {
      const bookingId = row.original.bookingId;
      return bookingId ? `#${bookingId}` : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = String(row.getValue("status"));
      return (
        <Badge variant={getStatusVariant(status)}>
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "startedAt",
    header: "Bắt đầu",
    cell: ({ row }) => (
      <div>{formatDateTime(row.getValue("startedAt") as string)}</div>
    ),
  },
  {
    accessorKey: "targetSoc",
    header: "SOC mục tiêu",
    cell: ({ row }) => (
      <div>{formatWithSuffix(row.original.targetSoc, "%")}</div>
    ),
  },
  {
    accessorKey: "chargerPowerKw",
    header: "Công suất sạc",
    cell: ({ row }) => (
      <div>{formatWithSuffix(row.original.chargerPowerKw, " kW")}</div>
    ),
  },
  {
    accessorKey: "connectorMaxPowerKw",
    header: "Công suất cổng",
    cell: ({ row }) => (
      <div>{formatWithSuffix(row.original.connectorMaxPowerKw, " kW")}</div>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <SessionActionsCell session={row.original} />,
  },
];
