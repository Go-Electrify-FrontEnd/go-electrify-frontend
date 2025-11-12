"use client";

import { SharedDataTable } from "@/components/shared-data-table";
import bookingColumns from "@/features/stations/components/bookings-table-columns";
import { StationBooking } from "../schemas/station.schema";

interface BookingsTableProps {
  data: StationBooking[];
}

export function BookingsTable({ data }: BookingsTableProps) {
  return (
    <SharedDataTable
      columns={bookingColumns}
      data={data}
      searchColumn="code"
      searchPlaceholder="Tìm kiếm mã giữ chỗ..."
      emptyMessage="Không có giữ chỗ nào."
    />
  );
}
