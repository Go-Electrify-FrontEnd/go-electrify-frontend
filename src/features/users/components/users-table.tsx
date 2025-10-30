"use client";

import { SharedDataTable } from "@/components/shared/shared-data-table";
import { userColumns } from "./users-table-columns";
import type { UserApi } from "@/lib/zod/user/user.types";

interface UsersTableProps {
  data: UserApi[];
}

export function UsersTable({ data }: UsersTableProps) {
  return (
    <SharedDataTable
      columns={userColumns}
      data={data}
      searchColumn="email"
      searchPlaceholder="Tìm kiếm người dùng..."
      emptyMessage="Không có người dùng nào."
    />
  );
}
