"use client";

import { SharedDataTable } from "@/components/shared/shared-data-table";
import { columns } from "./reservation-table-columns";
import type { ReservationDetails } from "../services/reservations-api";

interface ReservationTableProps {
  data: ReservationDetails[];
}

export function ReservationTable({ data }: ReservationTableProps) {
  return (
    <SharedDataTable
      columns={columns as any}
      data={data as any}
      searchColumn="stationName"
      searchPlaceholder="Tìm kiếm theo tên trạm..."
      emptyMessage="Không có đặt chỗ nào."
      emptyTitle="Chưa có đặt chỗ"
    />
  );
}
