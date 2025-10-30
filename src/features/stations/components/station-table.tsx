"use client";

import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./station-table-columns";
import { Station } from "../schemas/station.schema";

interface StationsTableProps {
  data: Station[];
}

export function StationsTable({ data }: StationsTableProps) {
  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm theo tên trạm..."
      emptyMessage="Không có trạm nào."
    />
  );
}
