"use client";

import * as React from "react";
import { SharedDataTable } from "@/components/shared-data-table";
import {
  sessionColumns,
  type SessionRow,
} from "@/features/stations/components/session-table-columns";

interface SessionsTableProps {
  data: SessionRow[];
}

export function SessionsTable({ data }: SessionsTableProps) {
  return (
    <SharedDataTable
      columns={sessionColumns}
      data={data}
      searchColumn="chargerCode"
      searchPlaceholder="Tìm kiếm dock hoặc phiên..."
      emptyTitle="Không có phiên sạc"
      emptyMessage="Chưa có phiên sạc nào cho trạm này."
    />
  );
}
