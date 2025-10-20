"use client";

import * as React from "react";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { sessionColumns, Session } from "./session-table-columns";

interface SessionsTableProps {
  data: Session[];
}

export function SessionsTable({ data }: SessionsTableProps) {
  return (
    <SharedDataTable
      columns={sessionColumns}
      data={data}
      searchColumn="userName"
      searchPlaceholder="Tìm kiếm phiên..."
      emptyMessage="Không có phiên nào."
    />
  );
}
