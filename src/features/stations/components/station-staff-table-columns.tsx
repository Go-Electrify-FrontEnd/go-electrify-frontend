"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/formatters";
import { StationStaffRow } from "@/lib/zod/station/station-staff.schema";

export const stationStaffColumns: ColumnDef<StationStaffRow>[] = [
  {
    accessorKey: "userId",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-medium">#{row.getValue("userId")}</div>
    ),
  },
  {
    accessorKey: "userEmail",
    header: "Email",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("userEmail")}</div>
    ),
  },
  {
    accessorKey: "userFullName",
    header: "Họ và Tên",
    cell: ({ row }) => {
      const fullName = row.original.userFullName;
      return (
        <div className="max-w-[150px] truncate">
          {fullName || (
            <span className="text-muted-foreground italic">Chưa cập nhật</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "assignedAt",
    header: "Ngày Phân Công",
    cell: ({ row }) => (
      <div className="text-sm">
        {formatDateTime(row.getValue("assignedAt") as string)}
      </div>
    ),
  },
  {
    accessorKey: "revokedAt",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const revokedAt = row.original.revokedAt;
      return revokedAt ? (
        <Badge variant="destructive">Đã thu hồi</Badge>
      ) : (
        <Badge variant="default">Đang hoạt động</Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const staff = row.original;
      const isRevoked = !!staff.revokedAt;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!isRevoked && (
              <DropdownMenuItem
                onClick={() => {
                  // TODO: Implement revoke staff action
                  console.log("Revoke staff:", staff.userId);
                }}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Thu hồi quyền
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
