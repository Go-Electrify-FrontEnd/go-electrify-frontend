"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@/features/users/contexts/user-context";
import { Loader2 } from "lucide-react";

// Schema validation cho form
const depositSchema = z.object({
  userId: z.string().min(1, "Vui lòng nhập ID người dùng."),
  amount: z
    .string()
    .min(1, "Vui lòng nhập số tiền.")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Số tiền phải là một số lớn hơn 0",
    }),
  note: z.string().optional(),
});

type DepositFormValues = z.infer<typeof depositSchema>;

export default function DepositCustomersPage() {
  // Mặc định mở modal ngay khi vào trang
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { token } = useUser();

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      userId: "",
      amount: "",
      note: "",
    },
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      router.back();
    }, 300);
  };

  // Hàm xử lý khi submit form
  const onSubmit = async (data: DepositFormValues) => {
    if (!token) {
      console.error("Chưa đăng nhập hoặc không có token");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://api.go-electrify.com/api/v1/users/${data.userId}/wallet/deposit-manual`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Amount: parseFloat(data.amount),
            Note: data.note || "Staff manual deposit",
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Nạp tiền thất bại:", errorData);
      } else {
        console.log("Nạp tiền thành công");
        handleModalClose();
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleModalClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nạp tiền thủ công</DialogTitle>
          <DialogDescription>
            Nạp tiền trực tiếp vào ví của người dùng.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID (*)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập ID của người dùng" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền (VNĐ) (*)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số tiền"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Vd: Thưởng sự kiện, hoàn tiền..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Xác nhận nạp
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
