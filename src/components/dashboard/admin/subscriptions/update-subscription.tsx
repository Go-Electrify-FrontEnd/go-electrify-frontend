"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Subscription } from "./columns";

interface UpdateSubscriptionProps {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateSubscription({
  subscription,
  open,
  onOpenChange,
}: UpdateSubscriptionProps) {
  const [name, setName] = useState(subscription.name);
  const [price, setPrice] = useState(subscription.price.toString());
  const [totalKwh, setTotalKwh] = useState(subscription.totalKwh.toString());
  const [durationDays, setDurationDays] = useState(
    subscription.durationDays.toString(),
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Vui lòng nhập tên gói");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Vui lòng nhập giá hợp lệ");
      return;
    }

    if (!totalKwh || Number(totalKwh) <= 0) {
      toast.error("Vui lòng nhập tổng kWh hợp lệ");
      return;
    }

    if (!durationDays || Number(durationDays) <= 0) {
      toast.error("Vui lòng nhập thời hạn hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Cập nhật gói đăng ký thành công!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật gói đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName(subscription.name);
    setPrice(subscription.price.toString());
    setTotalKwh(subscription.totalKwh.toString());
    setDurationDays(subscription.durationDays.toString());
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm();
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa gói đăng ký</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin gói đăng ký. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên gói *</Label>
              <Input
                id="name"
                placeholder="Nhập tên gói đăng ký"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1000"
                placeholder="199000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalKwh">Tổng kWh *</Label>
              <Input
                id="totalKwh"
                type="number"
                min="0"
                step="0.1"
                placeholder="100"
                value={totalKwh}
                onChange={(e) => setTotalKwh(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="durationDays">Thời hạn (ngày) *</Label>
              <Input
                id="durationDays"
                type="number"
                min="1"
                step="1"
                placeholder="30"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
