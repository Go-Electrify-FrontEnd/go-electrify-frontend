"use client";

import { toast } from "sonner";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./car-model-table-columns";
import { CarModel } from "@/types/car";
import { useCallback } from "react";

interface CarModelsTableProps {
  data: CarModel[];
}

export function CarModelsTable({ data }: CarModelsTableProps) {
  const handleMassDelete = useCallback(async (selected: CarModel[]) => {
    // TODO: Replace with actual deletion logic when API is available
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Đã xóa mẫu xe (mô phỏng)", {
      description: `${selected.length} mẫu xe sẽ được xóa khỏi hệ thống.`,
    });
  }, []);

  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="modelName"
      searchPlaceholder="Tìm kiếm mẫu xe..."
      emptyMessage="Không có mẫu xe nào."
      onMassDelete={handleMassDelete}
    />
  );
}
