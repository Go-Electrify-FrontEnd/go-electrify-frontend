"use client";

import * as React from "react";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./connector-type-table-columns";
import type { ConnectorType } from "@/lib/zod/connector-type/connector-type.types";

interface ConnectorTypesTableProps {
  data: ConnectorType[];
}

export function ConnectorTypesTable({ data }: ConnectorTypesTableProps) {
  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm cổng kết nối..."
      emptyMessage="Không có cổng kết nối nào."
    />
  );
}
