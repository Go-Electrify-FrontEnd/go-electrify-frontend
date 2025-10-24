"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/lib/zod/wallet/wallet.types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const typeLabels: Record<Transaction["type"], string> = {
  DEPOSIT: "Nạp tiền",
  BOOKING_FEE: "Phí đặt chỗ",
  CHARGING_FEE: "Sạc xe",
  REFUND: "Hoàn tiền",
};

const statusVariants: Record<
  Transaction["status"],
  "default" | "secondary" | "destructive"
> = {
  SUCCEEDED: "default",
  PENDING: "secondary",
  FAILED: "destructive",
};

const statusLabels: Record<Transaction["status"], string> = {
  SUCCEEDED: "Thành công",
  PENDING: "Đang xử lý",
  FAILED: "Thất bại",
};

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-10 gap-1 px-0 py-0 leading-none"
      >
        Mã GD
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      const type = row.getValue("type") as Transaction["type"];
      return <div>{typeLabels[type]}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as Transaction["status"];
      return (
        <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-10 gap-1 px-0 py-0 leading-none"
      >
        Ngày
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as Date | string;
      const date = value instanceof Date ? value : new Date(String(value));
      return <div>{format(date, "dd/MM/yyyy HH:mm", { locale: vi })}</div>;
    },
  },
  {
    accessorKey: "note",
    header: "Ghi chú",
    cell: ({ row }) => {
      const note = row.getValue("note") as string | null;
      return <div className="max-w-xs truncate">{note || "—"}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-10 gap-1 px-0 py-0 leading-none"
      >
        Số tiền
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const type = row.original.type;
      const isPositive = type === "DEPOSIT" || type === "REFUND";

      return (
        <div className="font-medium">
          <span
            className={
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {isPositive ? "+" : "−"}
            {amount.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      );
    },
  },
];
