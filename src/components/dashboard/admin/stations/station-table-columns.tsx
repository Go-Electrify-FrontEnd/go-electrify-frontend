"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Station } from "@/lib/zod/station/station.types";
import { StationActions } from "./station-actions";
import { cn } from "@/lib/utils";
import Link from "next/link";

function StatusCell({ value }: { value: string }) {
  const lowerValue = value.toLowerCase();
  const label =
    lowerValue === "active"
      ? "Hoạt động"
      : lowerValue === "inactive"
        ? "Không hoạt động"
        : "Bảo trì";

  const color =
    lowerValue === "active"
      ? "bg-emerald-500"
      : lowerValue === "inactive"
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
  } catch (e) {
    return <div className="font-medium">-</div>;
  }
}

export const columns: ColumnDef<Station>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
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
