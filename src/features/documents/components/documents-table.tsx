"use client";

import { DataTable } from "@/components/ui/data-table";
import { documentsColumns } from "./documents-table-columns";
import type { Document } from "../schemas/document.types";

interface DocumentsTableProps {
  data: Document[];
}

export function DocumentsTable({ data }: DocumentsTableProps) {
  return (
    <DataTable
      columns={documentsColumns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm tài liệu..."
      emptyMessage="Không tìm thấy dữ liệu"
      emptyDescription="Không có tài liệu nào."
    />
  );
}
