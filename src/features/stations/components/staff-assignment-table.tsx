"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StaffAssignmentDialog } from "./staff-assignment-dialog";
import type { Station } from "@/lib/zod/station/station.types";
import type { User } from "@/lib/zod/user/user.types";

interface StaffAssignmentTableProps {
  stations: Station[];
  staffList: User[];
}

interface StationWithStaff extends Station {
  assignedStaff: User[];
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên trạm</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Nhân viên được phân công</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stations.map((station) => (
            <TableRow key={station.id}>
              <TableCell className="font-medium">{station.id}</TableCell>
              <TableCell className="font-medium">{station.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-xs truncate text-sm">
                {station.address}
              </TableCell>
              <TableCell>
                {station.assignedStaff.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {station.assignedStaff.map((staff) => (
                      <Badge
                        key={staff.uid}
                        variant="outline"
                        className="gap-1.5"
                      >
                        <span className="max-w-[200px] truncate">
                          {staff.name || staff.email}
                        </span>
                        <button
                          onClick={() =>
                            handleRemoveStaff(station.id, staff.uid)
                          }
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
              </TableCell>
              <TableCell className="text-right">
                <StaffAssignmentDialog
                  station={station}
                  staffList={staffList}
                  onAssign={handleAssignStaff}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
