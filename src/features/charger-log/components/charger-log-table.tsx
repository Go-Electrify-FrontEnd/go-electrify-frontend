"use client";

import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Inbox } from "lucide-react";
import { chargerLogColumns } from "./charger-log-table-columns";
import type { ChargerLogItem } from "../schemas/charger-log.schema";

interface ChargerLogTableProps {
  data: ChargerLogItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export function ChargerLogTable({
  data,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: ChargerLogTableProps) {
  const router = useRouter();

  const table = useReactTable({
    data,
    columns: chargerLogColumns,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater({
          pageIndex: currentPage - 1,
          pageSize: pageSize,
        });
        router.push(`?page=${newPagination.pageIndex + 1}`, {
          scroll: false,
        });
      }
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`, { scroll: false });
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border p-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12">
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-row-index={row.index}
                  className="h-14"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={chargerLogColumns.length} className="p-8">
                  <Empty className="border-muted-foreground/30 bg-muted/40 border border-dashed p-8">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Inbox className="h-6 w-6" aria-hidden="true" />
                      </EmptyMedia>
                      <EmptyTitle>Không có dữ liệu</EmptyTitle>
                      <EmptyDescription>
                        Không tìm thấy log cho bộ sạc này.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Trang {currentPage} của {totalPages} ({totalItems} dòng)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!canPreviousPage}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!canNextPage}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
