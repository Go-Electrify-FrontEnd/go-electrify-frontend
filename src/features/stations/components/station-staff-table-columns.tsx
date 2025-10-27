// src/features/stations/components/station-staff-table-columns.tsx
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
import { StationStaff } from "@/lib/zod/station/station-staff.schema";
import { revokeStaffFromStation } from "@/features/stations/api/stations-api";
import { useRouter } from "next/navigation";

export const stationStaffColumns = (
  stationId: string,
): ColumnDef<StationStaff>[] => [
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
  },
  {
    accessorKey: "userFullName",
    header: "Họ và Tên",
    cell: ({ row }) => (
      <div>
        {row.original.userFullName || (
          <span className="text-muted-foreground italic">Chưa cập nhật</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "assignedAt",
    header: "Ngày Phân Công",
    cell: ({ row }) => formatDateTime(row.getValue("assignedAt")),
  },
  {
    accessorKey: "revokedAt",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const revoked = !!row.original.revokedAt;
      return revoked ? (
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
      const router = useRouter();

      const handleRevoke = async () => {
        if (!confirm("Thu hồi quyền truy cập của nhân viên này?")) return;
        try {
          const token = await fetch("/api/auth/token").then((r) =>
            r.ok ? r.json().then((d) => d.token) : null,
          );
          if (!token) throw new Error("Không có token");

          await revokeStaffFromStation(stationId, String(staff.userId), token);
          router.refresh();
        } catch (err: any) {
          alert(err.message || "Không thể thu hồi");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!staff.revokedAt && (
              <DropdownMenuItem onClick={handleRevoke} className="text-red-600">
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
