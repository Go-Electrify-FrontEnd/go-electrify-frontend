"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Loader2, Wallet } from "lucide-react";
import { User } from "./page"; // Import type từ file page.tsx

// Schema validation cho form (đã BỎ userId)
const depositSchema = z.object({
  amount: z
    .string()
    .min(1, "Vui lòng nhập số tiền.")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Số tiền phải là một số lớn hơn 0",
    }),
  note: z.string().optional(),
});

type DepositFormValues = z.infer<typeof depositSchema>;

interface DepositCustomersClientProps {
  initialUsers: User[];
}

export function DepositCustomersClient({
  initialUsers,
}: DepositCustomersClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useUser();
  const router = useRouter();

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: "",
      note: "",
    },
  });

  useEffect(() => {
    if (!selectedUser) {
      form.reset();
    }
  }, [selectedUser, form]);

  const onSubmit = async (data: DepositFormValues) => {
    if (!token || !selectedUser) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://api.go-electrify.com/api/v1/users/${selectedUser.Id}/wallet/deposit-manual`,
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
        throw new Error("Nạp tiền thất bại");
      }

      console.log("Nạp tiền thành công");
      setSelectedUser(null);

      router.refresh();
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tên đầy đủ</TableHead>
              <TableHead>Số dư (VNĐ)</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không tìm thấy user nào.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.Id}>
                  <TableCell className="font-medium">{user.Id}</TableCell>
                  <TableCell>{user.Email}</TableCell>
                  <TableCell>{user.FullName || "Chưa cập nhật"}</TableCell>
                  <TableCell>
                    {user.WalletBalance.toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Nạp tiền
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nạp tiền thủ công</DialogTitle>
            <DialogDescription>
              Bạn đang nạp tiền cho: <strong>{selectedUser?.Email}</strong>
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  onClick={() => setSelectedUser(null)}
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
    </>
  );
}
