"use client";

import * as React from "react";
import { toast } from "sonner";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./connector-type-table-columns";
import { ConnectorType } from "@/types/connector";

interface ConnectorTypesTableProps {
  data: ConnectorType[];
}

export function ConnectorTypesTable({ data }: ConnectorTypesTableProps) {
  const handleMassDelete = React.useCallback(
    async (selected: ConnectorType[]) => {
      // TODO: Integrate with backend deletion API
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Đã xóa cổng kết nối (mô phỏng)", {
        description: `${selected.length} cổng kết nối sẽ được xóa khỏi hệ thống.`,
      });
    },
    [],
  );

  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm cổng kết nối..."
      emptyMessage="Không có cổng kết nối nào."
      onMassDelete={handleMassDelete}
    />
  );
}
