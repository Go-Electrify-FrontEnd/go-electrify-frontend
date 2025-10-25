"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Station } from "@/lib/zod/station/station.types";
import type { User } from "@/lib/zod/user/user.types";

interface StaffAssignmentDialogProps {
  station: Station;
  staffList: User[];
  onAssign: (stationId: number, staff: User) => void;
}

export function StaffAssignmentDialog({
  station,
  staffList,
  onAssign,
}: StaffAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);

  // Debug logs
  console.log("StaffAssignmentDialog - staffList:", staffList);
  console.log("StaffAssignmentDialog - staffList length:", staffList.length);

  const filteredStaff = staffList.filter((staff) =>
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  console.log("Filtered staff:", filteredStaff);
  console.log("Search query:", searchQuery);

  const handleAssign = () => {
    if (!selectedStaff) return;

    onAssign(station.id, selectedStaff);
    setSelectedStaff(null);
    setSearchQuery("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Phân công
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Phân công nhân viên</DialogTitle>
          <DialogDescription>
            Chọn nhân viên để phân công cho trạm: {station.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tìm kiếm nhân viên (Tổng: {staffList.length} staff)
            </label>
            <Input
              placeholder="Tìm theo email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-2">
            {staffList.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <p>Không có nhân viên nào</p>
                <p className="mt-2 text-xs">Kiểm tra API response</p>
              </div>
            ) : filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <div
                  key={staff.uid}
                  onClick={() => setSelectedStaff(staff)}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    selectedStaff?.uid === staff.uid
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {staff.email}
                      </div>
                      <div className="text-muted-foreground mt-0.5 text-xs">
                        ID: {staff.uid} | Role: {staff.role}
                      </div>
                    </div>
                    {selectedStaff?.uid === staff.uid && (
                      <div className="bg-primary ml-2 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full">
                        <svg
                          className="text-primary-foreground h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                Không tìm thấy nhân viên với email: "{searchQuery}"
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAssign} disabled={!selectedStaff}>
              <UserPlus className="mr-2 h-4 w-4" />
              Phân công
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
