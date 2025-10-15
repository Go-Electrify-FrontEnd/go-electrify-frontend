"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Wallet, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { useServerAction } from "@/hooks/use-server-action";
import { Spinner } from "@/components/ui/spinner";
import { walletTopupSchema } from "@/lib/zod/wallet/wallet.request";
import { handleCreateTopup } from "@/actions/wallet-actions";
import type { TopupResponse } from "@/lib/zod/wallet/wallet.types";

const initialState = {
  success: false,
  msg: "",
  data: undefined as TopupResponse | undefined,
};

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
  const schema = walletTopupSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { amount: 10000 },
  });

  const { execute, pending } = useServerAction(
    handleCreateTopup,
    initialState,
    {
      onSuccess: (result) => {
        if (result.success) {
          if (result.data?.checkoutUrl) {
            window.location.href = result.data.checkoutUrl;
            return;
          }

          toast.success("Yêu cầu nạp tiền đã được tạo");
          setOpen(false);
          form.reset();
        }
      },
      onError: (result) => {
        if (result.msg) {
          toast.error("Không thể nạp tiền", { description: result.msg });
        }
      },
    },
  );

  const quickAmounts = [
    50000, 100000, 200000, 500000, 1000000, 1500000, 2000000, 2500000, 3000000,
  ];

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("amount", data.amount.toString());
    execute(formData);
  });

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
          <form className="space-y-2" onSubmit={handleSubmit}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="amount"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="amount">
                      {t["dialog.amountLabel"]}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="amount"
                      type="number"
                      placeholder="10000"
                      aria-invalid={fieldState.invalid}
                      step={1000}
                      value={
                        typeof field.value === "number" ||
                        typeof field.value === "string"
                          ? field.value
                          : ""
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <div className="space-y-2">
            <FieldLabel>{t["dialog.quickAmountsLabel"]}</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  onClick={() => form.setValue("amount", quickAmount)}
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
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => form.reset()}
              disabled={pending}
            >
              Hủy
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={pending}>
            {pending ? (
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
