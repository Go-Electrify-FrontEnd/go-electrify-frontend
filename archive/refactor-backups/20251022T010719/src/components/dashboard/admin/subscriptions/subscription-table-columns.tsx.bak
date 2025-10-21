"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionsCell } from "./subscription-actions";
import type { Subscription } from "@/lib/zod/subscription/subscription.types";
function PriceCell({ value }: { value: number }) {
  const nf = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
  return <div className="font-medium">{nf.format(value)}</div>;
}

function KwhCell({ value }: { value: number }) {
  const nf = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
  return <div className="font-medium">{nf.format(value)} kWh</div>;
}

export const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("id")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Tên gói",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <PriceCell value={price} />;
    },
  },
  {
    accessorKey: "totalKwh",
    header: "Tổng kWh",
    cell: ({ row }) => {
      const kwh = row.getValue("totalKwh") as number;
      return <KwhCell value={kwh} />;
    },
  },
  {
    accessorKey: "durationDays",
    header: "Thời hạn",
    cell: ({ row }) => {
      const days = row.getValue("durationDays") as number;
      return <Badge variant="secondary">{days} ngày</Badge>;
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell subscription={row.original} />,
  },
];
