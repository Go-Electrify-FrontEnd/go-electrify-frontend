"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Copy, Shield } from "lucide-react";
import type { UserApi } from "@/features/users/schemas/user.types";
import { useUser } from "@/features/users/contexts/user-context";
import { hasRole } from "@/lib/auth/role-check";
import { useRouter } from "next/navigation";
import { changeUserRoleAction } from "@/app/(app-layout)/dashboard/admin/users/actions";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface UserActionsProps {
  user: UserApi;
}

const ALL_ROLES = ["Admin", "Staff", "Driver"] as const;

export function UserActionsCell({ user }: UserActionsProps) {
  const [copied, setCopied] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [nextRole, setNextRole] = useState<string | null>(null);
  const [forceSignOut, setForceSignOut] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { user: me } = useUser();
  const router = useRouter();

  const canChangeRole = hasRole(me, "admin");

  async function handleConfirmChangeRole() {
    if (!nextRole || nextRole === user.role) {
      setRoleOpen(false);
      return;
    }

    try {
      setSubmitting(true);
      await changeUserRoleAction(Number(user.id), nextRole, forceSignOut);

      // ✅ Thông báo thành công
      toast.success(
        `Đổi vai trò thành công! Người dùng #${user.id} đã được chuyển từ ${user.role} sang ${nextRole}.`,
      );

      router.refresh();
      setRoleOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Đổi vai trò thất bại. Vui lòng thử lại sau!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(String(user.id));
              setCopied(true);
              toast.success("Đã sao chép ID người dùng!");
              setTimeout(() => setCopied(false), 1200);
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Đã sao chép ID" : "Sao chép ID"}
          </DropdownMenuItem>

          {canChangeRole && (
            <DropdownMenuItem
              onClick={() => {
                setNextRole(user.role);
                setForceSignOut(true);
                setRoleOpen(true);
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              Đổi vai trò
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog đổi vai trò */}
      <Dialog open={roleOpen} onOpenChange={setRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi vai trò cho người dùng #{user.id}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="text-muted-foreground text-sm">
              Vai trò hiện tại: <b>{user.role}</b>
            </div>

            <Select
              value={nextRole ?? undefined}
              onValueChange={(val) => setNextRole(val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={forceSignOut}
                onCheckedChange={(v) => setForceSignOut(Boolean(v))}
              />
              <span>Đăng xuất khỏi tất cả phiên</span>
            </label>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRoleOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmChangeRole} disabled={submitting}>
              {submitting ? "Đang lưu..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
