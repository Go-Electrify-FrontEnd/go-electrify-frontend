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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus } from "lucide-react";

export default function WalletDepositButton() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);

    if (!amount || isNaN(depositAmount) || depositAmount <= 0) {
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Implement actual deposit logic here
      // await depositToWallet(depositAmount);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success - close dialog and reset
      setOpen(false);
      setAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [50000, 100000, 200000, 500000];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nạp tiền
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Nạp tiền vào ví
          </DialogTitle>
          <DialogDescription>
            Nhập số tiền bạn muốn nạp vào ví của mình.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (VNĐ)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Nhập số tiền"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1000"
            />
          </div>

          <div className="space-y-2">
            <Label>Chọn nhanh</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="justify-start"
                >
                  {quickAmount.toLocaleString("vi-VN")} đ
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isProcessing}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "Nạp tiền"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
