"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { SessionActionsCell } from "./session-actions";

export type Session = {
  id: string | number;
  kind: "charging" | "reservation";
  dock?: string;
  userName?: string;
  start: string; // ISO
  end?: string | null; // ISO or null for ongoing
  status: string;
  soc?: number;
  estimatedCost?: number;
};

const formatCurrency = (amount?: number) =>
  amount == null
    ? ""
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);

const formatDate = (iso?: string | null) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
};

const getKindVariant = (kind: string) => {
  switch (kind) {
    case "charging":
      return "default";
    case "reservation":
      return "secondary";
    default:
      return "secondary";
  }
};

const getStatusVariant = (status: string) => {
  const s = String(status).toLowerCase();
  if (s === "active" || s === "charging") return "default";
  if (s === "pending") return "secondary";
  // map completed/finished to default to avoid using an unsupported 'success' variant
  if (s === "completed" || s === "finished") return "default";
  if (s === "error" || s === "offline") return "destructive";
  return "secondary";
};

export const sessionColumns: ColumnDef<Session>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "dock",
    header: "Dock",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("dock")}</div>
    ),
  },
  {
    accessorKey: "kind",
    header: "Loại",
    cell: ({ row }) => (
      <Badge variant={getKindVariant(String(row.getValue("kind")))}>
        {String(row.getValue("kind"))}
      </Badge>
    ),
  },
  {
    accessorKey: "userName",
    header: "Người dùng",
    cell: ({ row }) => <div>{row.getValue("userName")}</div>,
  },
  {
    accessorKey: "start",
    header: "Bắt đầu",
    cell: ({ row }) => <div>{formatDate(row.getValue("start") as string)}</div>,
  },
  {
    accessorKey: "end",
    header: "Kết thúc",
    cell: ({ row }) => (
      <div>{formatDate(row.getValue("end") as string | null)}</div>
    ),
  },
  {
    accessorKey: "soc",
    header: "SOC",
    cell: ({ row }) => <div>{(row.getValue("soc") as number) ?? "-"}%</div>,
  },
  {
    accessorKey: "estimatedCost",
    header: "Chi phí (VND)",
    cell: ({ row }) => (
      <div className="font-semibold">
        {formatCurrency(row.getValue("estimatedCost") as number)}
      </div>
    ),
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
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const session = row.original;
      return <SessionActionsCell session={session} />;
    },
  },
];
