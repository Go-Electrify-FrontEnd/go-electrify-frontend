"use client";

import { toast } from "sonner";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { CarModel } from "@/types/car";
import { useCallback, useMemo } from "react";
// Translations removed; using Vietnamese literals
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

  // Create translation function for table columns
  const t = (key: string): string => {
    const translations: Record<string, string> = {
      "table.modelName": "Mẫu xe",
      "table.maxPower": "Công suất tối đa",
      "table.batteryCapacity": "Dung lượng pin",
      "table.connectorTypes": "Loại cổng",
      "table.actions": "Thao tác",
    };
    return translations[key] || key;
  };

  const columns = useMemo(() => vehicleModelTableColumns(t), [t]);

  const handleMassDelete = useCallback(
    async (selected: CarModel[]) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(tCommon.delete, {
        description: `${selected.length} Mẫu xe`,
      });
    },
    [t, tCommon],
  );

  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="modelName"
      searchPlaceholder={tCommon.search}
      emptyMessage={tCommon.noData}
      onMassDelete={handleMassDelete}
    />
  );
}
