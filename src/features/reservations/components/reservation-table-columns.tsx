"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyVND, formatDateTime } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import type { Reservation } from "@/lib/zod/reservation/reservation.types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReservationDetails } from "../services/reservations-api";

const getStatusVariant = (status: string) => {
  switch (String(status).toUpperCase()) {
    case "CONFIRMED":
      return "default";
    case "PENDING":
      return "secondary";
    case "CONSUMED":
    case "COMPLETED":
      return "outline";
    case "CANCELED":
      return "destructive";
    default:
      return "secondary";
  }
};

const translateStatus = (status: string) => {
  switch (String(status).toUpperCase()) {
    case "CONFIRMED":
      return "Đã xác nhận";
    case "PENDING":
      return "Chờ xử lý";
    case "CONSUMED":
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELED":
      return "Đã hủy";
    case "EXPIRED":
      return "Đã hết hạn";
    default:
      return status;
  }
};

export const columns: ColumnDef<ReservationDetails>[] = [
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
    accessorKey: "stationName",
    header: "Trạm",
    cell: ({ row }) => (
      <div className="text-foreground">{row.getValue("stationName")}</div>
    ),
    filterFn: (row, id, value) => {
      const stationName = row.getValue(id) as string;
      return stationName.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "vehicleModelName",
    header: "Mẫu xe",
    cell: ({ row }) => {
      const vehicleModelName = row.getValue("vehicleModelName") as string;
      return <div className="text-foreground">{vehicleModelName}</div>;
    },
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
    accessorKey: "connectorTypeName",
    header: "Loại cổng",
    cell: ({ row }) => {
      const connectorTypeName = row.getValue("connectorTypeName") as string;
      return <div className="text-foreground">{connectorTypeName}</div>;
    },
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
          {formatCurrencyVND(safeAmount)}
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
              Sao chép ID
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
