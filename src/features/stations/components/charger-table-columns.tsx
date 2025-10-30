"use client";

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

export const columns: ColumnDef<Charger>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "code",
    header: "Mã Dock",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("code")}</div>
    ),
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
        {String(row.getValue("status"))}
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
