"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./reservation-table-columns";
import type { ReservationApi } from "../schemas/reservation.schema";

interface ReservationTableProps {
  data: ReservationApi[];
}

export function ReservationTable({ data }: ReservationTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="stationName"
      searchPlaceholder="Tìm kiếm theo tên trạm..."
      emptyMessage="Không tìm thấy dữ liệu"
      emptyDescription="Không có đặt chỗ nào."
    />
  );
}
