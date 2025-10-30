"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Subscription } from "../schemas/subscription.types";
import { useServerAction } from "@/hooks/use-server-action";
import {
  subscriptionDeleteSchema,
  type SubscriptionDeleteFormData,
} from "../schemas/subscription.request";
import { deleteSubscription } from "../services/subscriptions-actions";

interface DeleteSubscriptionProps {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSubscription({
  subscription,
  open,
  onOpenChange,
}: DeleteSubscriptionProps) {
  const [pending, setPending] = useState(false);

  const { execute } = useServerAction(
    deleteSubscription,
    { success: false, msg: "" },
    {
      onSettled: (result) => {
        if (result.success) {
          toast.success("Loại đăng ký đã được xóa", {
            description: result.msg,
          });
          onOpenChange(false);
          form.reset();
        } else if (result.msg) {
          toast.error("Xóa không thành công", { description: result.msg });
        }
        setPending(false);
      },
    },
  );

  const form = useForm<SubscriptionDeleteFormData>({
    resolver: zodResolver(subscriptionDeleteSchema),
    defaultValues: {
      confirmText: "",
    },
  });

  const confirmText = form.watch("confirmText");
  const isInputValid = confirmText === subscription.name;

  const onSubmit: SubmitHandler<SubscriptionDeleteFormData> = (data) => {
    if (data.confirmText !== subscription.name) {
      form.setError("confirmText", {
        type: "manual",
        message: "Tên gói đăng ký không khớp. Vui lòng nhập chính xác tên gói.",
      });
      return;
    }

    setPending(true);
    const formData = new FormData();
    formData.append("id", subscription.id.toString());
    execute(formData);
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa gói đăng ký</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">
              Bạn có chắc chắn muốn xóa gói{" "}
              <span className="font-semibold">{subscription.name}</span>?
            </span>
            <br />
            <span className="block">
              Điều này có thể ảnh hưởng đến các người dùng đang sử dụng gói này.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          id="delete-form"
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <input type="hidden" name="id" value={subscription.id} />

          <FieldGroup>
            <Controller
              control={form.control}
              name="confirmText"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="confirmText">
                    Xác nhận xóa:{" "}
                    <span className="font-semibold">{subscription.name}</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Nhập tên gói đăng ký để xác nhận"
                    disabled={pending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Hủy
          </Button>
          <Button
            form="delete-form"
            variant="destructive"
            type="submit"
            disabled={pending || !isInputValid}
          >
            {pending ? "Đang xóa..." : "Xóa"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
