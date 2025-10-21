"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Station } from "@/lib/zod/station/station.types";
import { StationActions } from "./station-actions";
import { cn } from "@/lib/utils";
import Link from "next/link";

function StatusCell({ value }: { value: string }) {
  const upper = String(value).toUpperCase();
  const label =
    upper === "ACTIVE"
      ? "Hoạt động"
      : upper === "INACTIVE"
        ? "Không hoạt động"
        : "Bảo trì";

  const color =
    upper === "ACTIVE"
      ? "bg-emerald-500"
      : upper === "INACTIVE"
        ? "bg-red-500"
        : "bg-yellow-500";
  return (
    <Badge variant="outline" className="-ml-2 gap-1.5">
      <span
        className={cn("size-1.5 rounded-full", color)}
        aria-hidden="true"
      ></span>
      {label}
    </Badge>
  );
}

function DateCell({ value }: { value: Date }) {
  try {
    return (
      <div className="font-medium">{value.toLocaleDateString("vi-VN")}</div>
    );
  } catch {
    return <div className="font-medium">-</div>;
  }
}

export const columns: ColumnDef<Station>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên trạm",
    cell: ({ row }) => (
      <Link
        prefetch={false}
        className="font-medium underline"
        href={`/dashboard/staff/stations/${row.getValue("id")}`}
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.getValue("address")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <StatusCell value={row.getValue("status") as string} />,
  },
  {
    accessorKey: "createdAt",
    header: "Tạo lúc",
    cell: ({ row }) => <DateCell value={row.getValue("createdAt") as Date} />,
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <StationActions station={row.original} />,
  },
];
