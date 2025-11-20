"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { formatCurrencyVND } from "@/lib/formatters";
import { toast } from "sonner";
import type { Subscription } from "../schemas/subscription.types";
import { useServerAction } from "@/hooks/use-server-action";
import { purchaseSubscription } from "../services/subscriptions-actions";

interface SubscriptionDetailsDialogProps {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = { success: false, msg: "" };

export function SubscriptionDetailsDialog({
  subscription,
  open,
  onOpenChange,
}: SubscriptionDetailsDialogProps) {
  const { execute, pending } = useServerAction(
    purchaseSubscription,
    initialState,
    {
      onSettled: (result) => {
        if (result.success) {
          toast.success("Mua gói đăng ký thành công!", {
            description: `Bạn đã mua gói ${subscription.name}`,
          });
          onOpenChange(false);
        } else {
          toast.error("Mua gói đăng ký thất bại", {
            description:
              result.msg || "Có lỗi xảy ra khi mua gói này. Vui lòng thử lại.",
          });
        }
      },
    },
  );

  const handlePurchase = () => {
    const formData = new FormData();
    formData.append("SubscriptionId", subscription.id.toString());

    execute(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {subscription.name}
          </DialogTitle>
          <DialogDescription className="text-center">
            {subscription.durationDays} ngày -{" "}
            {formatCurrencyVND(subscription.price)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold">
                {subscription.totalKwh} kWh
              </div>
              <div className="text-muted-foreground text-sm">
                Tổng công suất
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {subscription.durationDays} ngày
              </div>
              <div className="text-muted-foreground text-sm">Thời hạn</div>
            </div>
          </div>

          <div className="text-muted-foreground space-y-2 text-sm">
            <div className="text-center">
              Không thể hoàn tiền sau khi kích hoạt
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={pending}
            className="flex-1"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? "Đang xử lý..." : "Mua gói"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
