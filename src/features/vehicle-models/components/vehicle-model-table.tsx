"use client";

import { DataTable } from "@/components/ui/data-table";
import { vehicleModelTableColumns } from "./vehicle-model-table-columns";
import { CarModel } from "@/features/vehicle-models/schemas/vehicle-model.schema";

interface VehicleModelTableProps {
  data: CarModel[];
}

export function VehicleModelTable({ data }: VehicleModelTableProps) {
  return (
    <DataTable
      columns={vehicleModelTableColumns}
      data={data}
      searchColumn="modelName"
      searchPlaceholder="Tìm kiếm"
      emptyMessage="Không tìm thấy dữ liệu"
      emptyDescription="Không có dữ liệu"
    />
  );
}
