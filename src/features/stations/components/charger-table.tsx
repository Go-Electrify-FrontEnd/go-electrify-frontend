"use client";

import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "@/features/stations/components/charger-table-columns";
import { Charger } from "@/features/chargers/schemas/charger.schema";

interface ChargersTableProps {
  data: Charger[];
}

export function ChargersTable({ data }: ChargersTableProps) {
  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="code"
      searchPlaceholder="Tìm kiếm dock..."
      emptyMessage="Không có dock nào."
    />
  );
}
