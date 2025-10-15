"use client";

import { toast } from "sonner";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import type { CarModel } from "@/lib/zod/vehicle-model/vehicle-model.types";
import { useCallback } from "react";
import { vehicleModelTableColumns } from "./vehicle-model-table-columns";

interface VehicleModelTableProps {
  data: CarModel[];
}

export function VehicleModelTable({ data }: VehicleModelTableProps) {
  const tCommon = {
    delete: "Xóa",
    search: "Tìm kiếm",
    noData: "Không có dữ liệu",
  };

  const handleMassDelete = useCallback(
    async (selected: CarModel[]) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(tCommon.delete, {
        description: `${selected.length} Mẫu xe`,
      });
    },
    [tCommon],
  );

  return (
    <SharedDataTable
      columns={vehicleModelTableColumns}
      data={data}
      searchColumn="Mẫu xe"
      searchPlaceholder={tCommon.search}
      emptyMessage={tCommon.noData}
      onMassDelete={handleMassDelete}
    />
  );
}
