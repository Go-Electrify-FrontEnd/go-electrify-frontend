"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/wallet";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const typeLabels: Record<Transaction["Type"], string> = {
  DEPOSIT: "Nạp tiền",
  WITHDRAW: "Rút tiền",
  CHARGE: "Sạc xe",
  REFUND: "Hoàn tiền",
};

const statusVariants: Record<
  Transaction["Status"],
  "default" | "secondary" | "destructive"
> = {
  SUCCEEDED: "default",
  PENDING: "secondary",
  FAILED: "destructive",
};

const statusLabels: Record<Transaction["Status"], string> = {
  SUCCEEDED: "Thành công",
  PENDING: "Đang xử lý",
  FAILED: "Thất bại",
};

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "Id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-10 gap-1 px-0 py-0 leading-none"
        >
          Mã GD
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">#{row.getValue("Id")}</div>;
    },
  },
  {
    accessorKey: "Type",
    header: "Loại",
    cell: ({ row }) => {
      const type = row.getValue("Type") as Transaction["Type"];
      return <div>{typeLabels[type]}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "Status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("Status") as Transaction["Status"];
      return (
        <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "CreatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-10 gap-1 px-0 py-0 leading-none"
        >
          Ngày
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("CreatedAt") as string;
      return (
        <div>
          {format(new Date(date), "dd/MM/yyyy HH:mm", {
            locale: vi,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "Note",
    header: "Ghi chú",
    cell: ({ row }) => {
      const note = row.getValue("Note") as string | null;
      return <div className="max-w-xs truncate">{note || "—"}</div>;
    },
  },
  {
    accessorKey: "Amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-10 gap-1 px-0 py-0 leading-none"
        >
          Số tiền
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("Amount") as number;
      const type = row.original.Type;
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
