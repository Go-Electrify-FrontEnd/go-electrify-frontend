"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { ChargingHistoryItem } from "../types/session.types";
import { formatDateTime } from "@/lib/formatters";

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}g ${minutes}p`;
  }
  return `${minutes}p`;
}

function StatusBadge({ status }: { status: ChargingHistoryItem["status"] }) {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge
          variant="default"
          className="border-green-500/20 bg-green-500/10 text-green-600"
        >
          <CheckCircle2 className="size-3" />
          Hoàn tất
        </Badge>
      );
    case "ABORTED":
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/20 text-yellow-600"
        >
          <AlertCircle className="size-3" />
          Đã hủy
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="destructive">
          <XCircle className="size-3" />
          Thất bại
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export const columns: ColumnDef<ChargingHistoryItem>[] = [
  {
    accessorKey: "id",
    header: "ID Phiên",
    cell: ({ row }) => {
      return <div className="font-medium">#{row.getValue("id")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as ChargingHistoryItem["status"];
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "startedAt",
    header: "Bắt đầu lúc",
    cell: ({ row }) => {
      const startedAt = row.getValue("startedAt") as string;
      return (
        <div className="text-muted-foreground">{formatDateTime(startedAt)}</div>
      );
    },
  },
  {
    accessorKey: "durationSeconds",
    header: "Thời lượng",
    cell: ({ row }) => {
      const duration = row.getValue("durationSeconds") as number;
      return <div>{formatDuration(duration)}</div>;
    },
  },
  {
    accessorKey: "energyKwh",
    header: "Năng lượng",
    cell: ({ row }) => {
      const energy = row.getValue("energyKwh") as number;
      return <div>{energy.toFixed(2)} kWh</div>;
    },
  },
];
