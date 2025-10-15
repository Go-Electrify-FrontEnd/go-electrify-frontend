"use client";

import * as React from "react";
import { toast } from "sonner";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./station-table-columns";
import type { Station } from "@/lib/zod/station/station.types";

interface StationsTableProps {
  data: Station[];
}

export function StationsTable({ data }: StationsTableProps) {
  const handleMassDelete = React.useCallback(async (selected: Station[]) => {
    // TODO: replace with actual bulk delete server action
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Đã xóa trạm (mô phỏng)", {
      description: `${selected.length} trạm đã được xóa (mô phỏng).`,
    });
  }, []);

  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm theo tên trạm..."
      emptyMessage="Không có trạm nào."
      onMassDelete={handleMassDelete}
    />
  );
}
