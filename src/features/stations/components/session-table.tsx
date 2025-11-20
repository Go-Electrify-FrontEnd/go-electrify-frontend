"use client";

import { DataTable } from "@/components/ui/data-table";
import { sessionColumns } from "./session-table-columns";
import type { StationSession } from "../schemas/station-session.schema";

interface SessionTableProps {
  data: StationSession[];
}

export function SessionTable({ data }: SessionTableProps) {
  return (
    <DataTable
      columns={sessionColumns}
      data={data}
      searchColumn="userName"
      searchPlaceholder="Tìm kiếm theo tên người dùng..."
      emptyMessage="Không tìm thấy dữ liệu"
      emptyDescription="Không có phiên nào."
    />
  );
}
