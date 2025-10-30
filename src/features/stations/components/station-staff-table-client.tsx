"use client";

import { SharedDataTable } from "@/components/shared/shared-data-table";
import { createStationStaffColumns } from "./station-staff-table-columns";
import { StationStaff } from "../schemas/station-staff.schema";

export function StationStaffTableClient({
  stationId,
  data,
}: {
  stationId: string;
  data: StationStaff[];
}) {
  return (
    <SharedDataTable
      columns={createStationStaffColumns(stationId)}
      data={data}
      searchColumn="userEmail"
      searchPlaceholder="Tìm kiếm email nhân viên..."
      emptyTitle="Chưa có nhân viên"
      emptyMessage="Chưa có nhân viên nào được phân công cho trạm này. Nhấn nút phía trên để thêm nhân viên."
    />
  );
}
