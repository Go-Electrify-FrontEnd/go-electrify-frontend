"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./station-table-columns";
import { Station } from "../schemas/station.schema";

interface StationsTableProps {
  data: Station[];
}

export function StationsTable({ data }: StationsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm theo tên trạm..."
      emptyMessage="Không tìm thấy dữ liệu"
      emptyDescription="Không có trạm nào."
    />
  );
}
