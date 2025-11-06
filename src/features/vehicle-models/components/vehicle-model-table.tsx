"use client";

import { SharedDataTable } from "@/components/shared-data-table";
import { vehicleModelTableColumns } from "./vehicle-model-table-columns";
import { CarModel } from "@/features/vehicle-models/schemas/vehicle-model.schema";

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
      searchColumn="modelName"
      searchPlaceholder={tCommon.search}
      emptyMessage={tCommon.noData}
    />
  );
}
