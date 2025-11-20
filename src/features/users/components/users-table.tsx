"use client";

import { DataTable } from "@/components/ui/data-table";
import { userColumns } from "./users-table-columns";
import type { UserApi } from "@/features/users/schemas/user.types";

interface UsersTableProps {
  data: UserApi[];
}

export function UsersTable({ data }: UsersTableProps) {
  return (
    <DataTable
      columns={userColumns}
      data={data}
      searchColumn="email"
      searchPlaceholder="Tìm kiếm người dùng..."
      emptyMessage="Không tìm thấy dữ liệu"
      emptyDescription="Không có người dùng nào."
    />
  );
}
