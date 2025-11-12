"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyVND, formatDateTime } from "@/lib/formatters";
import { ReservationDetails } from "../services/reservations-api";
import { ActionsCell } from "./reservation-actions-cell";

const getStatusVariant = (status: string) => {
  switch (String(status).toUpperCase()) {
    case "CONFIRMED":
      return "default";
    case "PENDING":
      return "secondary";
    case "CONSUMED":
    case "COMPLETED":
      return "outline";
    case "CANCELED":
      return "destructive";
    default:
      return "secondary";
  }
};

const translateStatus = (status: string) => {
  switch (String(status).toUpperCase()) {
    case "CONFIRMED":
      return "Đã xác nhận";
    case "PENDING":
      return "Chờ xử lý";
    case "CONSUMED":
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELED":
      return "Đã hủy";
    case "EXPIRED":
      return "Đã hết hạn";
    default:
      return status;
  }
};

export const columns: ColumnDef<ReservationDetails>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="text-foreground font-medium">#{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "code",
    header: "Mã",
    cell: ({ row }) => (
      <div className="text-foreground font-medium">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "stationName",
    header: "Trạm",
    cell: ({ row }) => (
      <div className="text-foreground">{row.getValue("stationName")}</div>
    ),
    filterFn: (row, id, value) => {
      const stationName = row.getValue(id) as string;
      return stationName.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "scheduledStart",
    header: "Bắt đầu dự kiến",
    cell: ({ row }) => (
      <div className="text-foreground text-sm">
        {formatDateTime(row.getValue("scheduledStart"))}
      </div>
    ),
  },
  {
    accessorKey: "connectorTypeName",
    header: "Loại cổng",
    cell: ({ row }) => {
      const connectorTypeName = row.getValue("connectorTypeName") as string;
      return <div className="text-foreground">{connectorTypeName}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusVariant(status)} className="font-medium">
          {translateStatus(status)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell reservation={row.original} />,
  },
];
