"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionsCell } from "./subscription-actions";
import { Subscription } from "@/types/subscription";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
};

export const columns: ColumnDef<Subscription>[] = [
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      );
    },
  },
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
      return <div className="font-medium">{formatPrice(price)}</div>;
    },
  },
  {
    accessorKey: "totalKwh",
    header: "Tổng kWh",
    cell: ({ row }) => {
      const kwh = row.getValue("totalKwh") as number;
      return <div className="font-medium">{kwh.toLocaleString()} kWh</div>;
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
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <div className="text-muted-foreground">{formatDate(date)}</div>;
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell subscription={row.original} />,
  },
];
