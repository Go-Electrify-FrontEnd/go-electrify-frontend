"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./connector-type-table-columns";
import { ConnectorType } from "@/features/connector-type/schemas/connector-type.schema";

interface ConnectorTypesTableProps {
  data: ConnectorType[];
}

export function ConnectorTypesTable({ data }: ConnectorTypesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm cổng kết nối..."
      emptyMessage="Không tìm thấy dữ liệu"
      emptyDescription="Không có cổng kết nối nào."
    />
  );
}
