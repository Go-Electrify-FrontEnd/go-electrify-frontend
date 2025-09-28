"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  SlidersHorizontal,
  CheckSquare,
  Trash2,
  XSquare,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface SharedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onMassDelete?: (selectedRows: TData[]) => Promise<void> | void;
  onSelectionChange?: (selectedRows: TData[]) => void;
  selectAllLabel?: string;
  deselectAllLabel?: string;
  massDeleteLabel?: string;
}

export function SharedDataTable<TData, TValue>({
  columns,
  data,
  searchColumn = "name",
  searchPlaceholder = "Tìm kiếm...",
  emptyMessage = "Không có dữ liệu.",
  onMassDelete,
  onSelectionChange,
  selectAllLabel = "Chọn tất cả",
  deselectAllLabel = "Bỏ chọn tất cả",
  massDeleteLabel = "Xóa hàng loạt",
}: SharedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isMassDeleteLoading, setIsMassDeleteLoading] = useState(false);
  const [isToolbarMounted, setIsToolbarMounted] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

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
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRowCount = table.getSelectedRowModel().rows.length;
  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const hasMassDelete = typeof onMassDelete === "function";

  useEffect(() => {
    if (!onSelectionChange) {
      return;
    }

    onSelectionChange(
      table.getSelectedRowModel().rows.map((row) => row.original),
    );
  }, [onSelectionChange, table, rowSelection]);

  useEffect(() => {
    if (selectedRowCount > 0 && !isToolbarMounted) {
      setIsToolbarMounted(true);
    }

    if (selectedRowCount === 0) {
      setIsConfirmOpen(false);
    }
  }, [selectedRowCount, isToolbarMounted]);

  useGSAP(
    () => {
      const element = toolbarRef.current;
      if (!element) {
        return;
      }

      if (selectedRowCount > 0) {
        gsap.to(element, {
          y: 0,
          autoAlpha: 1,
          duration: 0.35,
          ease: "power3.out",
        });
      } else {
        gsap.to(element, {
          y: 120,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setIsToolbarMounted(false),
        });
      }
    },
    { scope: toolbarRef, dependencies: [selectedRowCount, isToolbarMounted] },
  );

  const handleSelectAllFiltered = useCallback(() => {
    table.getFilteredRowModel().rows.forEach((row) => {
      if (!row.getIsSelected()) {
        row.toggleSelected(true);
      }
    });
  }, [table]);

  const handleDeselectAll = useCallback(() => {
    table.resetRowSelection();
  }, [table]);

  const executeMassDelete = useCallback(async () => {
    if (!hasMassDelete) {
      return;
    }

    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedRows.length === 0) {
      return;
    }

    try {
      setIsMassDeleteLoading(true);
      await Promise.resolve(onMassDelete?.(selectedRows));
      table.resetRowSelection();
      setIsConfirmOpen(false);
    } finally {
      setIsMassDeleteLoading(false);
    }
  }, [hasMassDelete, onMassDelete, table]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(searchColumn)
                  ?.setFilterValue(event.target.value)
              }
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
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide(),
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
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
                  data-state={row.getIsSelected() && "selected"}
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
                  colSpan={columns.length}
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
        <div
          className="text-muted-foreground flex-1 text-sm"
          aria-live="polite"
          aria-atomic="true"
        >
          {table.getFilteredSelectedRowModel().rows.length} trong{" "}
          {filteredRowCount} dòng được chọn.
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

      {/* Thanh Toolbar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
        {isToolbarMounted && (
          <div
            ref={toolbarRef}
            role="region"
            aria-live="polite"
            aria-hidden={selectedRowCount === 0}
            aria-label="Thanh công cụ hành động hàng loạt"
            className="border-border/80 bg-background/95 pointer-events-auto mx-auto flex w-full max-w-3xl transform flex-col gap-4 rounded-t-2xl border p-4 shadow-2xl backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
            style={{ transform: "translateY(120px)", opacity: 0 }}
          >
            <div className="flex items-start gap-3 sm:items-center">
              <span className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <CheckSquare className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-semibold">
                  {selectedRowCount} dòng được chọn
                </span>
                <span className="text-muted-foreground text-xs">
                  Chọn hành động để áp dụng cho các mục đã chọn.
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleSelectAllFiltered}
                disabled={filteredRowCount === 0}
                aria-label={selectAllLabel}
              >
                <CheckSquare className="mr-2 h-5 w-5" aria-hidden="true" />
                <span className="text-sm font-medium">{selectAllLabel}</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleDeselectAll}
                disabled={selectedRowCount === 0}
                aria-label={deselectAllLabel}
              >
                <XSquare className="mr-2 h-5 w-5" aria-hidden="true" />
                <span className="text-sm font-medium">{deselectAllLabel}</span>
              </Button>

              <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={!hasMassDelete || selectedRowCount === 0}
                    aria-label={massDeleteLabel}
                  >
                    <Trash2 className="mr-2 h-5 w-5" aria-hidden="true" />
                    <span className="text-sm font-semibold">
                      {massDeleteLabel}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa hàng loạt</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa {selectedRowCount} mục đã chọn?
                      Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isMassDeleteLoading}>
                      Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={executeMassDelete}
                      disabled={!hasMassDelete || isMassDeleteLoading}
                    >
                      {isMassDeleteLoading ? "Đang xóa..." : "Xóa"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
