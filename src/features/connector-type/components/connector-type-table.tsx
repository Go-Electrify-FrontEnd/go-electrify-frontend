"use client";

import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./connector-type-table-columns";
import { ConnectorType } from "@/types/connector";
interface ConnectorTypesTableProps {
  data: ConnectorType[];
}

export function ConnectorTypesTable({ data }: ConnectorTypesTableProps) {
  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm cổng kết nối..."
      emptyMessage="Không có cổng kết nối nào."
    />
  );
}
