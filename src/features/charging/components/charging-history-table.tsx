"use client";

import { useRouter } from "next/navigation";
import { SharedDataTable } from "@/components/shared-data-table";
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

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`, { scroll: false });
  };

  return (
    <SharedDataTable
      columns={columns}
      data={data}
      searchColumn="id"
      searchPlaceholder="Tìm kiếm theo ID phiên..."
      emptyMessage="Không tìm thấy lịch sử sạc."
      emptyTitle="Không có phiên sạc"
      serverSidePagination={{
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        onPageChange: handlePageChange,
      }}
    />
  );
}
