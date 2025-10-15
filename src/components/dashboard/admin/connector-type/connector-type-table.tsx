"use client";

import * as React from "react";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./connector-type-table-columns";
import type { ConnectorType } from "@/lib/zod/connector-type/connector-type.types";

interface ConnectorTypesTableProps {
  data: ConnectorType[];
}

export function ConnectorTypesTable({ data }: ConnectorTypesTableProps) {
  const handleMassDelete = React.useCallback(
    async (selected: ConnectorType[]) => {
      // TODO: Integrate with backend deletion API
      selected.forEach((ct) => {
        console.log("Deleting connector type ID:", ct.id);
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
