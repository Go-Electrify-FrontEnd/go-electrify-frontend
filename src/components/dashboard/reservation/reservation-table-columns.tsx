"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Reservation } from "@/lib/zod/reservation/reservation.types";

export type { Reservation };
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Helper function to format Vietnamese currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper function to format date
const formatDateTime = (date: string | Date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

// Helper function to get status badge variant
const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "completed":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

// Helper function to translate status
const translateStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "Đã xác nhận";
    case "pending":
      return "Chờ xử lý";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    case "expired":
      return "Đã hết hạn";
    default:
      return status;
  }
};

// Helper function to translate charging type
const translateType = (type: string) => {
  switch (type.toLowerCase()) {
    case "standard":
      return "Tiêu chuẩn";
    case "fast":
      return "Nhanh";
    case "rapid":
      return "Siêu nhanh";
    default:
      return type;
  }
};

export const columns: ColumnDef<Reservation>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="text-foreground font-medium">#{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "code",
    header: "Mã",
    cell: ({ row }) => (
      <div className="text-foreground font-medium">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "pointId",
    header: "Trạm",
    cell: ({ row }) => (
      <div className="text-foreground">Trạm #{row.getValue("pointId")}</div>
    ),
    filterFn: (row, id, value) => {
      const pointId = row.getValue(id) as number;
      return pointId.toString().includes(value);
    },
  },
  {
    accessorKey: "vehicleModelName",
    header: "Mẫu xe",
    cell: ({ row }) => (
      <div className="text-foreground">{row.getValue("vehicleModelName")}</div>
    ),
  },
  {
    accessorKey: "scheduledStart",
    header: "Bắt đầu dự kiến",
    cell: ({ row }) => (
      <div className="text-foreground text-sm">
        {formatDateTime(row.getValue("scheduledStart"))}
      </div>
    ),
  },
  {
    accessorKey: "scheduledEnd",
    header: "Kết thúc dự kiến",
    cell: ({ row }) => (
      <div className="text-foreground text-sm">
        {formatDateTime(row.getValue("scheduledEnd"))}
      </div>
    ),
  },
  {
    accessorKey: "initialSoc",
    header: "SOC ban đầu",
    cell: ({ row }) => (
      <div className="text-foreground text-left font-medium">
        {row.getValue("initialSoc")}%
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => (
      <div className="text-foreground">
        {translateType(row.getValue("type"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusVariant(status)} className="font-medium">
          {translateStatus(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "estimatedCost",
    header: "Chi phí ước tính",
    cell: ({ row }) => {
      const raw = row.getValue("estimatedCost") as unknown;
      const amount = Number(raw ?? 0);
      const safeAmount = Number.isFinite(amount) ? amount : 0;
      return (
        <div className="text-foreground text-left font-semibold">
          {formatCurrency(safeAmount)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableHiding: false,
    cell: ({ row }) => {
      const reservation = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hover:bg-muted h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-semibold">
              Hành động
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(reservation.id.toString())
              }
              className="cursor-pointer"
            >
              Sao chép ID đặt chỗ
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
              Hủy đặt chỗ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
