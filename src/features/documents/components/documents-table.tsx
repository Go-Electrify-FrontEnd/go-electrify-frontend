import { SharedDataTable } from "@/components/shared-data-table";
import { documentsColumns } from "./documents-table-columns";
import type { Document } from "../schemas/document.types";

interface DocumentsTableProps {
  data: Document[];
}

export function DocumentsTable({ data }: DocumentsTableProps) {
  return (
    <SharedDataTable<Document, unknown>
      columns={documentsColumns}
      data={data}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm tài liệu..."
      emptyMessage="Chưa có tài liệu nào được tải lên."
    />
  );
}
