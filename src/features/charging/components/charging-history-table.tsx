"use client";

import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Inbox, Search } from "lucide-react";
import { columns } from "./charging-history-table-columns";
import type { ChargingHistoryItem } from "../types/session.types";

interface ChargingHistoryTableProps {
  data: ChargingHistoryItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export function ChargingHistoryTable({
  data,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: ChargingHistoryTableProps) {
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
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
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo ID phiên..."
            disabled
            className="max-w-sm pl-8"
          />
        </div>
      </div>

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
                <TableCell colSpan={columns.length} className="p-8">
                  <Empty className="border-muted-foreground/30 bg-muted/40 border border-dashed p-8">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Inbox className="h-6 w-6" aria-hidden="true" />
                      </EmptyMedia>
                      <EmptyTitle>Không có phiên sạc</EmptyTitle>
                      <EmptyDescription>
                        Không tìm thấy lịch sử sạc.
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
