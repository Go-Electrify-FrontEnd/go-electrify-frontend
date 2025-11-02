"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserMinus, Loader2 } from "lucide-react";
import { revokeStaffFromStation } from "@/features/stations/api/stations-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAuthToken } from "@/features/stations/api/auth-actions";
import { useUser } from "@/contexts/user-context";

interface RevokeStaffActionProps {
  stationId: string;
  userId: number;
  userEmail: string;
}

export function RevokeStaffAction({
  stationId,
  userId,
  userEmail,
}: RevokeStaffActionProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { token } = useUser();

  const handleRevoke = () => {
    startTransition(async () => {
      try {
        if (!token) {
          toast.error("Phiên đăng nhập hết hạn");
          return;
        }

        const result = await revokeStaffFromStation(stationId, userId, token);
        console.log(result);

        if (result.success) {
          toast.success("Thu hồi quyền thành công");
          setOpen(false);
          router.refresh();
        } else {
          toast.error(`Không thể thu hồi quyền: ${result.error}`);
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi thu hồi quyền");
        console.error(error);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50"
      >
        <UserMinus className="mr-2 h-4 w-4" />
        Thu hồi quyền
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thu hồi quyền</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thu hồi quyền quản lý trạm của nhân viên{" "}
              <span className="text-foreground font-semibold">{userEmail}</span>
              ?
              <br />
              <br />
              Nhân viên này sẽ không còn quyền truy cập và quản lý trạm này nữa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRevoke();
              }}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Thu hồi quyền
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
