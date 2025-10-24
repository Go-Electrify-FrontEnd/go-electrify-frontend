"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyVND } from "@/lib/formatters";

export type Booking = {
  id: number;
  code: string;
  status: string;
  scheduledStart: string; // ISO
  initialSoc?: number | null;
  estimatedCost?: number | null;
  stationId?: number;
  connectorTypeId?: number;
  vehicleModelId?: number;
};

const formatCurrency = (amount?: number) =>
  amount == null ? "" : formatCurrencyVND(amount);

const formatDate = (iso?: string | null) => {
  if (!iso) return "-";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return String(iso);
  }
};

const getStatusVariant = (status?: string) => {
  const s = String(status ?? "").toUpperCase();
  switch (s) {
    case "PENDING":
      return "secondary" as const;
    case "CONFIRMED":
      return "default" as const;
    case "COMPLETED":
      return "default" as const;
    case "CANCELLED":
      return "outline" as const;
    case "EXPIRED":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
};

const getStatusLabel = (status?: string) => {
  const s = String(status ?? "").toUpperCase();
  switch (s) {
    case "PENDING":
      return "Chờ xử lý";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    case "EXPIRED":
      return "Hết hạn";
    default:
      return status ?? "—";
  }
};

export const bookingColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "code",
    header: "Mã giữ chỗ",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "scheduledStart",
    header: "Bắt đầu",
    cell: ({ row }) => (
      <div>{formatDate(row.getValue("scheduledStart") as string)}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.getValue("status") as string)}>
        {getStatusLabel(row.getValue("status") as string)}
      </Badge>
    ),
  },
  {
    accessorKey: "initialSoc",
    header: "SOC ban đầu",
    cell: ({ row }) => (
      <div>
        {typeof row.getValue("initialSoc") === "number"
          ? `${row.getValue("initialSoc")} %`
          : "—"}
      </div>
    ),
  },
  {
    accessorKey: "connectorTypeId",
    header: "Loại Kết Nối",
    cell: ({ row }) => <div>#{row.getValue("connectorTypeId")}</div>,
  },
  {
    accessorKey: "estimatedCost",
    header: "Ước tính chi phí",
    cell: ({ row }) => (
      <div className="font-semibold">
        {formatCurrency(row.getValue("estimatedCost") as number)}
      </div>
    ),
  },
];

export default bookingColumns;
