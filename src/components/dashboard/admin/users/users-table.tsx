"use client";

import * as React from "react";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { userColumns } from "./users-table-columns";
import type { UserApi } from "@/lib/zod/user/user.types";

interface UsersTableProps {
  data: UserApi[];
}

export function UsersTable({ data }: UsersTableProps) {
  const handleMassDelete = React.useCallback(async (selected: UserApi[]) => {
    // TODO: implement delete or bulk actions for users
    selected.forEach((u) => console.log("Selected user to delete", u.id));
  }, []);

  return (
    <SharedDataTable
      columns={userColumns}
      data={data}
      searchColumn="email"
      searchPlaceholder="Tìm kiếm người dùng..."
      emptyMessage="Không có người dùng nào."
      onMassDelete={handleMassDelete}
    />
  );
}
