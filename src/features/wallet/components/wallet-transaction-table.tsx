"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionColumns } from "./wallet-transaction-table-columns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Transaction } from "../schemas/wallet.schema";

type TransactionTableProps = {
  transactions: Transaction[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  showViewAll?: boolean;
};

export function TransactionTable({
  transactions,
  totalCount,
  currentPage = 1,
  pageSize = 20,
  showViewAll = false,
}: TransactionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: transactions,
    columns: transactionColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    rowCount: totalCount,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  // Calculate pagination info
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">Lịch Sử Giao Dịch</CardTitle>
            <CardDescription>
              Chi tiết các giao dịch nạp tiền và chi tiêu gần đây
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search bar */}
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Tìm kiếm giao dịch (mã, ghi chú)..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="py-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
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
                  <TableCell
                    colSpan={transactionColumns.length}
                    className="h-24 text-center"
                  >
                    Chưa có giao dịch nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer info and pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            {totalCount ? (
              <>
                Hiển thị {transactions.length} giao dịch (trang {currentPage} /{" "}
                {totalPages}) trong tổng số {totalCount}
              </>
            ) : (
              <>Hiển thị {transactions.length} giao dịch</>
            )}
          </div>

          {/* Pagination controls or View All button */}
          {showViewAll ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/wallet/transactions/1">
                Xem Tất Cả Giao Dịch
              </Link>
            </Button>
          ) : (
            totalPages > 1 &&
            totalCount &&
            totalCount > pageSize && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPrevPage}
                  asChild={hasPrevPage}
                >
                  {hasPrevPage ? (
                    <Link
                      href={`/dashboard/wallet/transactions/${currentPage - 1}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Link>
                  ) : (
                    <>
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </>
                  )}
                </Button>

                <span className="text-muted-foreground text-sm">
                  Trang {currentPage} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNextPage}
                  asChild={hasNextPage}
                >
                  {hasNextPage ? (
                    <Link
                      href={`/dashboard/wallet/transactions/${currentPage + 1}`}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <>
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TransactionTable;
