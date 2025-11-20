"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./charger-table-columns";
import { Charger } from "@/features/chargers/schemas/charger.schema";

interface ChargerTableProps {
  data: Charger[];
}

export function ChargerTable({ data }: ChargerTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm theo tên bộ sạc..."
      emptyMessage="Không tìm thấy dữ liệu"
      emptyDescription="Không có bộ sạc nào."
    />
  );
}
