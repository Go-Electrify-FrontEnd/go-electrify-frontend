"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { formatCurrencyVND } from "@/lib/formatters";
import { toast } from "sonner";
import type { Subscription } from "../schemas/subscription.types";
import { subscribeToPlan } from "../services/subscriptions-actions";

interface SubscriptionDetailsDialogProps {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionDetailsDialog({
  subscription,
  open,
  onOpenChange,
}: SubscriptionDetailsDialogProps) {
  const [pending, setPending] = useState(false);

  const handleSubscribe = async () => {
    setPending(true);
    try {
      // Here you would integrate with your payment/subscription service
      await subscribeToPlan(subscription.id);

      toast.success("Đăng ký thành công!", {
        description: `Bạn đã đăng ký gói ${subscription.name}`,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Đăng ký thất bại", {
        description: "Có lỗi xảy ra khi đăng ký gói này. Vui lòng thử lại.",
      });
    } finally {
      setPending(false);
    }
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
          {/* Key Information */}
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

          {/* Terms */}
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
            onClick={handleSubscribe}
            disabled={pending}
            className="flex-1"
          >
            {pending ? "Đang xử lý..." : "Đăng Ký"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
