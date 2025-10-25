"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { SharedDataTable } from "@/components/shared/shared-data-table";
import { StaffAssignmentDialog } from "./staff-assignment-dialog";
import type { Station } from "@/lib/zod/station/station.types";
import type { User } from "@/lib/zod/user/user.types";

interface StationWithStaff extends Station {
  assignedStaff: User[];
}

interface StaffAssignmentTableProps {
  stations: Station[];
  staffList: User[];
}

export function StaffAssignmentTable({
  stations: initialStations,
  staffList,
}: StaffAssignmentTableProps) {
  const [stations, setStations] = useState<StationWithStaff[]>(
    initialStations.map((station) => ({
      ...station,
      assignedStaff: [],
    })),
  );

  const handleAssignStaff = (stationId: number, staff: User) => {
    setStations((prev) =>
      prev.map((station) =>
        station.id === stationId
          ? {
              ...station,
              assignedStaff: [...station.assignedStaff, staff],
            }
          : station,
      ),
    );
  };

  const handleRemoveStaff = (stationId: number, staffUid: number) => {
    setStations((prev) =>
      prev.map((station) =>
        station.id === stationId
          ? {
              ...station,
              assignedStaff: station.assignedStaff.filter(
                (s) => s.uid !== staffUid,
              ),
            }
          : station,
      ),
    );
  };

  // Define columns for SharedDataTable
  const columns: ColumnDef<StationWithStaff, unknown>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
      accessorKey: "name",
      header: "Tên trạm",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ row }) => (
        <div className="text-muted-foreground max-w-xs truncate text-sm">
          {row.original.address}
        </div>
      ),
    },
    {
      id: "assignedStaff",
      header: "Nhân viên được phân công",
      cell: ({ row }) => {
        const station = row.original;
        return (
          <div>
            {station.assignedStaff.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {station.assignedStaff.map((staff) => (
                  <Badge key={staff.uid} variant="outline" className="gap-1.5">
                    <span className="max-w-[200px] truncate">
                      {staff.name || staff.email}
                    </span>
                    <button
                      onClick={() => handleRemoveStaff(station.id, staff.uid)}
                      className="hover:bg-accent ml-1 rounded-full p-0.5 transition-colors"
                      aria-label={`Xóa ${staff.name || staff.email}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">
                Chưa phân công
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const station = row.original;
        return (
          <div className="text-right">
            <StaffAssignmentDialog
              station={station}
              staffList={staffList}
              onAssign={handleAssignStaff}
            />
          </div>
        );
      },
    },
  ];

  return (
    <SharedDataTable
      columns={columns as ColumnDef<Record<string, unknown>, unknown>[]}
      data={stations as unknown as Record<string, unknown>[]}
      searchColumn="name"
      searchPlaceholder="Tìm kiếm theo tên trạm..."
      emptyMessage="Không có trạm nào trong hệ thống."
      emptyTitle="Không tìm thấy trạm"
    />
  );
}
