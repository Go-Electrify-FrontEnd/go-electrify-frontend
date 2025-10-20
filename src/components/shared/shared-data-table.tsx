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
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";

// Selection and toolbar removed — no GSAP animations required

/**
 * Generic shared table used across the app.
 * TData is constrained to an object to keep Row/Column typings simple.
 */
interface SharedDataTableProps<TData extends Record<string, unknown>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  selectAllLabel?: string;
  deselectAllLabel?: string;
}

export function SharedDataTable<TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  searchColumn = "name",
  searchPlaceholder = "Tìm kiếm...",
  emptyMessage = "Không có dữ liệu.",
  selectAllLabel = "Chọn tất cả",
  deselectAllLabel = "Bỏ chọn tất cả",
}: SharedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // selection removed

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });
  // selection removed; no selectedRowCount/filteredRowCount

  // selection change handler removed

  // toolbar mount logic removed

  // GSAP animation for toolbar removed

  // selection helpers removed

  // mass delete removed — no-op

  const resolvedSearchColumn = useMemo(() => {
    // Prefer explicit column id passed in props
    const col = table.getColumn(searchColumn as string);
    if (col) return col;

    // Fallback: pick the first leaf column that looks like a data column
    const fallback = table.getAllLeafColumns().find((c) => {
      // Narrow the ColumnDef union safely using `in` checks instead of
      // reading properties directly (which the type system may not allow).
      return (
        ("accessorFn" in c.columnDef &&
          typeof (c.columnDef as { accessorFn?: unknown }).accessorFn !==
            "undefined") ||
        ("accessorKey" in c.columnDef &&
          typeof (c.columnDef as { accessorKey?: unknown }).accessorKey !==
            "undefined")
      );
    });
    if (fallback) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[SharedDataTable] searchColumn '${searchColumn}' not found - falling back to column '${fallback.id}'.`,
        );
      }
      return fallback;
    }

    // Last resort: first leaf column (may be header/selection column)
    return table.getAllLeafColumns()[0];
  }, [table, searchColumn]);

  // Local controlled search input with debounce to avoid rapid table updates
  const [searchInput, setSearchInput] = useState<string>(
    (resolvedSearchColumn?.getFilterValue() as string) ?? "",
  );
  const debounceRef = useRef<number | null>(null);

  // Keep local input in sync when the resolved column changes (for example
  // when switching the searchColumn prop).
  useEffect(() => {
    setSearchInput((resolvedSearchColumn?.getFilterValue() as string) ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedSearchColumn?.id]);

  useEffect(() => {
    if (!resolvedSearchColumn) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      // Pass undefined for empty string to clear the filter
      resolvedSearchColumn.setFilterValue(searchInput || undefined);
    }, 250);
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [searchInput, resolvedSearchColumn]);

  // Memoize hideable columns for the visibility dropdown
  const hideableColumns = useMemo(
    () =>
      table.getAllColumns().filter((column) => {
        if (!column.getCanHide()) return false;
        return (
          ("accessorFn" in column.columnDef &&
            typeof (column.columnDef as { accessorFn?: unknown }).accessorFn !==
              "undefined") ||
          ("accessorKey" in column.columnDef &&
            typeof (column.columnDef as { accessorKey?: unknown })
              .accessorKey !== "undefined")
        );
      }),
    [table],
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              aria-label={`Tìm kiếm ${searchColumn}`}
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(e) => {
                // Allow users to apply immediately with Enter
                if (e.key === "Enter") {
                  resolvedSearchColumn?.setFilterValue(
                    searchInput || undefined,
                  );
                }
              }}
              className="max-w-sm pl-8"
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Hiển thị
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {hideableColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-12">
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
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Đang hiển thị {table.getRowModel().rows.length} trong tổng{" "}
          {data.length} dòng.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Row selection toolbar removed */}
    </div>
  );
}
