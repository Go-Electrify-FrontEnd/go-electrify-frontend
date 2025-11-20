"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyVND } from "@/lib/formatters";
import { ActionsCell } from "@/features/stations/components/charger-actions";
import { Charger } from "@/features/chargers/schemas/charger.schema";

const formatCurrency = (amount: number) => formatCurrencyVND(amount);
const formatPower = (power: number) => `${power} kW`;

const getStatusVariant = (status: string) => {
  switch (status.toUpperCase()) {
    case "ONLINE":
      return "default";
    case "OFFLINE":
      return "destructive";
    case "MAINTENANCE":
      return "secondary";
    default:
      return "secondary";
  }
};

const getStatusText = (status: string) => {
  switch (status.toUpperCase()) {
    case "ONLINE":
      return "Trực tuyến";
    case "OFFLINE":
      return "Ngoại tuyến";
    case "MAINTENANCE":
      return "Bảo trì";
    default:
      return status;
  }
};

export const columns: ColumnDef<Charger>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "code",
    header: "Mã Dock",
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      const id = row.getValue("id") as number | string;
      return (
        <Link
          href={`/dashboard/charger-log/${encodeURIComponent(String(id))}`}
          className="font-medium underline"
        >
          {code}
        </Link>
      );
    },
  },
  {
    accessorKey: "powerKw",
    header: "Công suất",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono">
        {formatPower(row.getValue("powerKw") as number)}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => (
      <Badge
        variant={getStatusVariant((row.getValue("status") as string) || "")}
      >
        {getStatusText((row.getValue("status") as string) || "")}
      </Badge>
    ),
  },
  {
    accessorKey: "pricePerKwh",
    header: "Giá (VND/kWh)",
    cell: ({ row }) => (
      <div className="font-semibold">
        {formatCurrency(row.getValue("pricePerKwh") as number)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Hành Động",
    cell: ({ row }) => {
      const charger = row.original;
      return <ActionsCell charger={charger} />;
    },
  },
];
