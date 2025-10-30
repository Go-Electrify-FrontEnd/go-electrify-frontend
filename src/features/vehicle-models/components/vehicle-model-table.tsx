"use client";

import { SharedDataTable } from "@/components/shared/shared-data-table";
import { vehicleModelTableColumns } from "./vehicle-model-table-columns";
import { CarModel } from "@/types/car";

interface VehicleModelTableProps {
  data: CarModel[];
}

export function VehicleModelTable({ data }: VehicleModelTableProps) {
  const tCommon = {
    delete: "Xóa",
    search: "Tìm kiếm",
    noData: "Không có dữ liệu",
  };

  return (
    <SharedDataTable
      columns={vehicleModelTableColumns}
      data={data}
      // use accessorKey for searching (column id), not the header label
      searchColumn="modelName"
      searchPlaceholder={tCommon.search}
      emptyMessage={tCommon.noData}
    />
  );
}
