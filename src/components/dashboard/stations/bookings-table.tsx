"use client";

import * as React from "react";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import bookingColumns from "./bookings-table-columns";
import type { Booking } from "./bookings-table-columns";

interface BookingsTableProps {
  data: Booking[];
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
