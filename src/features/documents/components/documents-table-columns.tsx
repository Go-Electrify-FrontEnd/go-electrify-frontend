"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import type { Document } from "../schemas/document.types";
import { DocumentStatusBadge } from "./document-status-badge";
import { DocumentActionsCell } from "./document-actions-cell";

/**
 * Column definitions for documents table
 * Follows Go-Electrify admin table patterns
 */
export const documentsColumns: ColumnDef<Document>[] = [
  {
    accessorKey: "name",
    header: "Tên Tài Liệu",
    cell: ({ row }) => (
      <div className="max-w-[300px]">
        <div className="truncate font-medium">{row.getValue("name")}</div>
        {row.original.description && (
          <div className="text-muted-foreground mt-0.5 truncate text-sm">
            {row.original.description}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
  },
  {
    accessorKey: "chunkCount",
    header: "Phần",
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("chunkCount")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => <DocumentStatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "source",
    header: "Tệp Nguồn",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm">
        {row.getValue("source")}
      </div>
    ),
  },
  {
    accessorKey: "uploadDate",
    header: "Ngày Tải Lên",
    cell: ({ row }) => (
      <div className="text-sm">{formatDate(row.getValue("uploadDate"))}</div>
    ),
  },
  {
    id: "actions",
    header: "Hành Động",
    cell: ({ row }) => <DocumentActionsCell document={row.original} />,
  },
];
