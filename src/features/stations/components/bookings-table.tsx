"use client";

import { DataTable } from "@/components/ui/data-table";
import { bookingColumns } from "./bookings-table-columns";
import type { StationBooking } from "../schemas/station.schema";

interface BookingsTableProps {
  data: StationBooking[];
}

export function BookingsTable({ data }: BookingsTableProps) {
  return (
    <DataTable
      columns={bookingColumns}
      data={data}
      searchColumn="userName"
      searchPlaceholder="Tìm kiếm theo tên người dùng..."
      emptyMessage="Không tìm thấy dữ liệu"
      emptyDescription="Không có đặt chỗ nào."
    />
  );
}
