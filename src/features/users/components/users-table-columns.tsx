"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UserActionsCell } from "./user-actions";
import type { UserApi } from "@/lib/zod/user/user.types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

const formatDate = (iso?: Date | string) => {
  if (!iso) return "-";
  const d = iso instanceof Date ? iso : new Date(iso);
  return d.toLocaleString();
};

const roleVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "default";
    case "driver":
      return "secondary";
    default:
      return "secondary";
  }
};

export const userColumns: ColumnDef<UserApi>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Họ Tên",
    cell: ({ row }) => <div>{row.getValue("fullName") ?? "-"}</div>,
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => (
      <Badge variant={roleVariant(String(row.getValue("role")))}>
        {String(row.getValue("role"))}
      </Badge>
    ),
  },
  {
    accessorKey: "walletBalance",
    header: "Số Dư (VND)",
    cell: ({ row }) => (
      <div className="font-semibold">
        {formatCurrency(row.getValue("walletBalance") as number)}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày Tạo",
    cell: ({ row }) => (
      <div>{formatDate(row.getValue("createdAt") as Date)}</div>
    ),
  },
  {
    id: "actions",
    header: "Hành Động",
    cell: ({ row }) => {
      const user = row.original;
      return <UserActionsCell user={user} />;
    },
  },
];
