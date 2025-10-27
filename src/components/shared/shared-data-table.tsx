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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Inbox, Search, SlidersHorizontal } from "lucide-react";
import { useState, useMemo } from "react";

interface SharedDataTableProps<TData extends Record<string, unknown>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptyTitle?: string;
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
}: SharedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const resolvedSearchColumn = useMemo(
    () => getSearchColumn(table, searchColumn),
    [table, searchColumn],
  );

  const searchValue = (resolvedSearchColumn?.getFilterValue() as string) ?? "";
  const hasRows = table.getRowModel().rows.length > 0;

  return (
    <div className="w-full space-y-4">
      <TableToolbar
        searchValue={searchValue}
        onSearchChange={(value) =>
          resolvedSearchColumn?.setFilterValue(value || undefined)
        }
        searchPlaceholder={searchPlaceholder}
        searchColumn={searchColumn}
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
        currentRows={table.getRowModel().rows.length}
        totalRows={data.length}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
      />
    </div>
  );
}

function TableToolbar<TData>({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchColumn,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchColumn: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        <Input
          aria-label={`Tìm kiếm ${searchColumn}`}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm pl-8"
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
}: {
  currentRows: number;
  totalRows: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}) {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">
        Đang hiển thị {currentRows} trong tổng {totalRows} dòng.
      </div>
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
