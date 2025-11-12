"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
  Table as TanStackTable,
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
import { useState } from "react";

interface SharedDataTableProps<TData extends Record<string, unknown>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptyTitle?: string;
  serverSidePagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

function isDataColumn(column: Column<any, unknown>): boolean {
  const hasAccessorFn =
    "accessorFn" in column.columnDef &&
    column.columnDef.accessorFn !== undefined;
  const hasAccessorKey =
    "accessorKey" in column.columnDef &&
    column.columnDef.accessorKey !== undefined;
  return hasAccessorFn || hasAccessorKey;
}

function getSearchColumn<TData>(
  table: TanStackTable<TData>,
  searchColumn: string,
): Column<TData, unknown> | undefined {
  const explicitColumn = table.getColumn(searchColumn);
  if (explicitColumn) return explicitColumn;

  const firstDataColumn = table.getAllLeafColumns().find(isDataColumn);
  if (firstDataColumn && process.env.NODE_ENV !== "production") {
    console.warn(
      `[SharedDataTable] searchColumn '${searchColumn}' not found, using '${firstDataColumn.id}'`,
    );
  }

  return firstDataColumn ?? table.getAllLeafColumns()[0];
}

export function SharedDataTable<TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  searchColumn = "name",
  searchPlaceholder = "Tìm kiếm...",
  emptyMessage = "Không có dữ liệu.",
  emptyTitle = "Không tìm thấy dữ liệu",
  serverSidePagination,
}: SharedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Use server-side pagination if provided, otherwise use client-side
  const isServerSide = !!serverSidePagination;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: isServerSide ? undefined : getSortedRowModel(),
    getFilteredRowModel: isServerSide ? undefined : getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: isServerSide,
    // Avoid injecting a bogus pageCount when operating client-side; TanStack will derive it automatically.
    pageCount: serverSidePagination
      ? serverSidePagination.totalPages
      : undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const resolvedSearchColumn = getSearchColumn(table, searchColumn);
  const rawSearchValue = resolvedSearchColumn?.getFilterValue();
  const searchValue = typeof rawSearchValue === "string" ? rawSearchValue : "";
  const rowModel = table.getRowModel();
  const hasRows = rowModel.rows.length > 0;
  const totalRows = serverSidePagination?.totalItems ?? data.length;
  const canPreviousPage = serverSidePagination
    ? serverSidePagination.currentPage > 1
    : table.getCanPreviousPage();
  const canNextPage = serverSidePagination
    ? serverSidePagination.currentPage < serverSidePagination.totalPages
    : table.getCanNextPage();

  const handleSearchChange = (value: string) => {
    resolvedSearchColumn?.setFilterValue(value ? value : undefined);
  };

  const handlePreviousPage = () => {
    if (serverSidePagination) {
      serverSidePagination.onPageChange(
        Math.max(1, serverSidePagination.currentPage - 1),
      );
      return;
    }

    table.previousPage();
  };

  const handleNextPage = () => {
    if (serverSidePagination) {
      serverSidePagination.onPageChange(
        Math.min(
          serverSidePagination.totalPages,
          serverSidePagination.currentPage + 1,
        ),
      );
      return;
    }

    table.nextPage();
  };

  const canSearch = Boolean(resolvedSearchColumn);

  return (
    <div className="w-full space-y-4">
      <TableToolbar
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
        searchColumn={searchColumn}
        disabled={!canSearch}
      />

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
            {hasRows ? (
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
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className="p-8"
                >
                  <EmptyState title={emptyTitle} message={emptyMessage} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TableFooter
        currentRows={rowModel.rows.length}
        totalRows={totalRows}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        serverSidePagination={serverSidePagination}
      />
    </div>
  );
}

function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchColumn,
  disabled,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchColumn: string;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        <Input
          aria-label={`Tìm kiếm ${searchColumn}`}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={
            disabled ? undefined : (e) => onSearchChange(e.target.value)
          }
          className="max-w-sm pl-8"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <Empty className="border-muted-foreground/30 bg-muted/40 border border-dashed p-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox className="h-6 w-6" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {message && <EmptyDescription>{message}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  );
}

function TableFooter({
  currentRows,
  totalRows,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  serverSidePagination,
}: {
  currentRows: number;
  totalRows: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  serverSidePagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}) {
  const displayText = serverSidePagination
    ? `Trang ${serverSidePagination.currentPage} của ${serverSidePagination.totalPages} (${serverSidePagination.totalItems} dòng)`
    : `Đang hiển thị ${currentRows} trong tổng ${totalRows} dòng.`;

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">{displayText}</div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={!canPreviousPage}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!canNextPage}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
