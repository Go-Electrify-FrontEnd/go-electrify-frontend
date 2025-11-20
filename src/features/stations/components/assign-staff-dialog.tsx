"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Check, Loader2 } from "lucide-react";
import { assignStaffToStation } from "@/features/stations/api/stations-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/contexts/user-context";
import { API_BASE_URL } from "@/lib/api-config";

interface User {
  id: number;
  email: string;
  fullName?: string;
  role: string;
}

interface AssignStaffDialogProps {
  stationId: string;
  assignedStaffIds: number[];
}

export function AssignStaffDialog({
  stationId,
  assignedStaffIds,
}: AssignStaffDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const router = useRouter();
  const { token } = useUser();

  useEffect(() => {
    if (open && users.length === 0) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      if (!token) {
        throw new Error("User not authenticated");
      }
      const response = await fetch(`${API_BASE_URL}/users?role=Staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const payload = await response.json();

      const allUsers = payload.Items || [];

      const normalizedUsers: User[] = allUsers.map((u: any) => ({
        id: u.Id,
        email: u.Email,
        fullName: u.FullName,
        role: u.Role,
      }));

      // Filter only staff users
      const staffUsers = normalizedUsers.filter(
        (user: User) => user.role.toLowerCase() === "staff",
      );

      console.log("Fetched staff users:", staffUsers); // Debug log
      setUsers(staffUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Filter users: not already assigned and match search query
  const availableUsers = users.filter(
    (user) =>
      !assignedStaffIds.includes(user.id) &&
      (searchQuery === "" ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleAssign = async () => {
    if (!selectedUserId) return;

    startTransition(async () => {
      try {
        if (!token) {
          toast.error("Phiên đăng nhập hết hạn");
          return;
        }

        const result = await assignStaffToStation(
          stationId,
          selectedUserId,
          token,
        );

        if (result.success) {
          toast.success("Phân công nhân viên thành công");
          setOpen(false);
          setSelectedUserId(null);
          setSearchQuery("");
          router.refresh();
        } else {
          toast.error(`Không thể phân công: Nhân viên đã được phân công`);
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi phân công nhân viên");
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <UserPlus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Phân công nhân viên</span>
          <span className="sm:hidden">Thêm</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Phân Công Nhân Viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo email hoặc tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              disabled={isLoadingUsers}
            />
          </div>

          {/* User List */}
          <div className="max-h-[400px] overflow-y-auto rounded-md border">
            {isLoadingUsers ? (
              <div className="text-muted-foreground flex items-center justify-center p-8">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Đang tải danh sách nhân viên...</span>
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="text-muted-foreground p-8 text-center">
                <UserPlus className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p className="font-medium">Không tìm thấy nhân viên</p>
                <p className="mt-1 text-sm">
                  {searchQuery
                    ? "Thử tìm kiếm với từ khóa khác"
                    : users.length === 0
                      ? "Không có nhân viên nào trong hệ thống"
                      : "Tất cả nhân viên đã được phân công"}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`hover:bg-muted/50 flex w-full items-center justify-between p-4 text-left transition-colors ${
                      selectedUserId === user.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium">#{user.id}</span>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                      <p className="truncate text-sm font-medium">
                        {user.email}
                      </p>
                      {user.fullName && (
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                          {user.fullName}
                        </p>
                      )}
                    </div>
                    {selectedUserId === user.id && (
                      <Check className="text-primary ml-2 h-5 w-5 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedUserId && (
            <div className="bg-muted rounded-md p-3 text-sm">
              <p className="text-muted-foreground">Đã chọn:</p>
              <p className="mt-1 font-medium">
                {availableUsers.find((u) => u.id === selectedUserId)?.email}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSelectedUserId(null);
              setSearchQuery("");
            }}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedUserId || isPending || isLoadingUsers}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Phân Công
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
