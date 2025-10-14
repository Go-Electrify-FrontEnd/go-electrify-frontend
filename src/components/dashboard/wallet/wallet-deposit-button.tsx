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
import { Spinner } from "@/components/ui/spinner";

export default function WalletDepositButton() {
  const t = {
    "button.deposit": "Nạp tiền",
    "dialog.title": "Nạp tiền vào ví",
    "dialog.description": "Chọn số tiền để nạp vào ví của bạn",
    "dialog.amountLabel": "Số tiền (VND)",
    "dialog.quickAmountsLabel": "Số tiền nhanh",
    "button.depositing": "Đang nạp...",
  };

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [
    50000, 100000, 200000, 500000, 1000000, 1500000, 2000000, 2500000, 3000000,
  ];

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t["button.deposit"]}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {t["dialog.title"]}
          </DialogTitle>
          <DialogDescription>{t["dialog.description"]}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">{t["dialog.amountLabel"]}</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1000"
            />
          </div>

          <div className="space-y-2">
            <Label>{t["dialog.quickAmountsLabel"]}</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="justify-start"
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(quickAmount)}
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
            {isProcessing ? (
              <>
                <Spinner /> {t["button.depositing"]}
              </>
            ) : (
              t["button.deposit"]
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
