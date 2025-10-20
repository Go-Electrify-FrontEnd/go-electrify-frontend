"use client";

import * as React from "react";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./charger-table-columns";
import type { Charger } from "@/lib/zod/charger/charger.types";

interface ChargersTableProps {
  data: Charger[];
}

export function ChargersTable({ data }: ChargersTableProps) {
  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="code"
      searchPlaceholder="Tìm kiếm dock..."
      emptyMessage="Không có dock nào."
    />
  );
}
