"use client";

import { toast } from "sonner";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { CarModel } from "@/types/car";
import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { vehicleModelTableColumns } from "./vehicle-model-table-columns";

interface VehicleModelTableProps {
  data: CarModel[];
}

export function VehicleModelTable({ data }: VehicleModelTableProps) {
  const t = useTranslations("vehicleModel");
  const tCommon = useTranslations("common");
  const columns = useMemo(() => vehicleModelTableColumns(t), [t]);

  const handleMassDelete = useCallback(
    async (selected: CarModel[]) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(tCommon("delete"), {
        description: `${selected.length} ${t("table.modelName")}`,
      });
    },
    [t, tCommon],
  );

  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="modelName"
      searchPlaceholder={tCommon("search")}
      emptyMessage={tCommon("noData")}
      onMassDelete={handleMassDelete}
    />
  );
}
