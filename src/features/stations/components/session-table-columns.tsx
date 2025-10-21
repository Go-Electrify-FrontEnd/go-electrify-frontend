import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
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

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return String(iso);
  }
  return date.toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const formatNumber = (value: number | null, suffix = "") => {
  if (value == null) return "-";
  return `${value}${suffix}`;
};

const getStatusVariant = (status: string) => {
  const normalized = String(status).toLowerCase();
  if (normalized === "active" || normalized === "charging") return "default";
  if (normalized === "stopped" || normalized === "completed") return "secondary";
  if (normalized === "error" || normalized === "faulted") return "destructive";
  return "secondary";
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
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(String(row.getValue("status")))}>
        {String(row.getValue("status"))}
      </Badge>
    ),
  },
  {
    accessorKey: "startedAt",
    header: "Bắt đầu",
    cell: ({ row }) => (
      <div>{formatDateTime(row.getValue("startedAt") as string)}</div>
    ),
  },
  {
    accessorKey: "initialSoc",
    header: "SOC bắt đầu",
    cell: ({ row }) => <div>{formatNumber(row.original.initialSoc, "%")}</div>,
  },
  {
    accessorKey: "targetSoc",
    header: "SOC mục tiêu",
    cell: ({ row }) => <div>{formatNumber(row.original.targetSoc, "%")}</div>,
  },
  {
    accessorKey: "chargerPowerKw",
    header: "Công suất sạc",
    cell: ({ row }) => (
      <div>{formatNumber(row.original.chargerPowerKw, " kW")}</div>
    ),
  },
  {
    accessorKey: "vehicleMaxPowerKw",
    header: "Công suất xe",
    cell: ({ row }) => (
      <div>{formatNumber(row.original.vehicleMaxPowerKw, " kW")}</div>
    ),
  },
  {
    accessorKey: "vehicleBatteryCapacityKwh",
    header: "Dung lượng pin",
    cell: ({ row }) => (
      <div>{formatNumber(row.original.vehicleBatteryCapacityKwh, " kWh")}</div>
    ),
  },
  {
    accessorKey: "connectorMaxPowerKw",
    header: "Công suất cổng",
    cell: ({ row }) => (
      <div>{formatNumber(row.original.connectorMaxPowerKw, " kW")}</div>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <SessionActionsCell session={row.original} />,
  },
];
