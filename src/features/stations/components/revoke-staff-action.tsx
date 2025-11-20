"use client";

import { useState, useTransition } from "react";
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
import { useUser } from "@/contexts/user-context";
import { Textarea } from "@/components/ui/textarea"; // <-- Import Textarea
import { Label } from "@/components/ui/label"; // <-- Import Label

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
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { token } = useUser();

  const handleRevoke = () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do thu hồi quyền.");
      return;
    }

    startTransition(async () => {
      try {
        if (!token) {
          toast.error("Phiên đăng nhập hết hạn");
          return;
        }

        const result = await revokeStaffFromStation(
          stationId,
          userId,
          token,
          reason.trim(),
        );

        if (result.success) {
          toast.success("Thu hồi quyền thành công");
          setOpen(false);
          setReason("");
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

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReason("");
    }
    setOpen(isOpen);
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

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thu hồi quyền</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thu hồi quyền của nhân viên{" "}
              <span className="text-foreground font-semibold">{userEmail}</span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="reason">Lý do thu hồi (*)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vd: Nhân viên nghỉ việc, vi phạm quy định..."
              disabled={isPending}
              className="min-h-[100px]"
            />
            <p className="text-muted-foreground text-xs">
              Lý do này là bắt buộc và sẽ được ghi lại.
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRevoke();
              }}
              disabled={isPending || !reason.trim()}
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
