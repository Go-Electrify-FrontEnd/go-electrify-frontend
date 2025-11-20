"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { ChargerLogItem } from "../schemas/charger-log.schema";
import { formatDateTime } from "@/lib/formatters";

function StateBadge({ state }: { state: string }) {
  const stateMap: Record<string, { label: string; className: string }> = {
    IDLE: {
      label: "Rảnh",
      className: "border-gray-500/20 bg-gray-500/10 text-gray-600",
    },
    CHARGING: {
      label: "Đang sạc",
      className: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    },
    COMPLETED: {
      label: "Hoàn tất",
      className: "border-green-500/20 bg-green-500/10 text-green-600",
    },
    ERROR: {
      label: "Lỗi",
      className: "border-red-500/20 bg-red-500/10 text-red-600",
    },
    SUSPENDED: {
      label: "Tạm dừng",
      className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600",
    },
  };

  const config = stateMap[state] || {
    label: state,
    className: "border-gray-500/20 bg-gray-500/10 text-gray-600",
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export const chargerLogColumns: ColumnDef<ChargerLogItem>[] = [
  {
    accessorKey: "sampleAt",
    header: "Thời gian",
    cell: ({ row }) => {
      const sampleAt = row.getValue("sampleAt") as string;
      return (
        <div className="text-muted-foreground">{formatDateTime(sampleAt)}</div>
      );
    },
  },
  {
    accessorKey: "state",
    header: "Trạng thái",
    cell: ({ row }) => {
      const state = row.getValue("state") as string;
      return <StateBadge state={state} />;
    },
  },
  {
    accessorKey: "socPercent",
    header: "SOC",
    cell: ({ row }) => {
      const soc = row.getValue("socPercent") as number;
      return <div className="font-medium">{soc}%</div>;
    },
  },
  {
    accessorKey: "voltage",
    header: "Điện áp",
    cell: ({ row }) => {
      const voltage = row.getValue("voltage") as number | null;
      return <div>{voltage !== null ? `${voltage.toFixed(1)} V` : "—"}</div>;
    },
  },
  {
    accessorKey: "current",
    header: "Dòng điện",
    cell: ({ row }) => {
      const current = row.getValue("current") as number | null;
      return <div>{current !== null ? `${current.toFixed(2)} A` : "—"}</div>;
    },
  },
  {
    accessorKey: "powerKw",
    header: "Công suất",
    cell: ({ row }) => {
      const power = row.getValue("powerKw") as number | null;
      return <div>{power !== null ? `${power.toFixed(2)} kW` : "—"}</div>;
    },
  },
  {
    accessorKey: "sessionEnergyKwh",
    header: "Năng lượng tích lũy",
    cell: ({ row }) => {
      const energy = row.getValue("sessionEnergyKwh") as number;
      return <div>{energy.toFixed(3)} kWh</div>;
    },
  },
  {
    accessorKey: "errorCode",
    header: "Mã lỗi",
    cell: ({ row }) => {
      const errorCode = row.getValue("errorCode") as string | null;
      return errorCode ? (
        <Badge variant="destructive" className="font-mono text-xs">
          {errorCode}
        </Badge>
      ) : (
        <div className="text-muted-foreground">—</div>
      );
    },
  },
];
