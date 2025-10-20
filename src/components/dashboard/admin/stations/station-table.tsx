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
  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm theo tên trạm..."
      emptyMessage="Không có trạm nào."
    />
  );
}
