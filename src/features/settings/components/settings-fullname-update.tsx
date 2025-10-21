"use client";
import { updateUserName } from "@/features/users/services/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUser } from "@/features/users/contexts/user-context";
import { useServerAction } from "@/hooks/use-server-action";
import { UserNameUpdateSchema } from "@/lib/zod/user/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function FullNameUpdate() {
  const { user } = useUser();
  const { execute, pending } = useServerAction(
    updateUserName,
    { success: false, msg: "" },
    {
      onSuccess: (result) => {
        toast.success("Hành động được thực hiện thành công", {
          description: result.msg,
        });
      },
      onError: (result) => {
        if (result.msg) {
          toast.error("Hành động không thành công", {
            description: result.msg,
          });
        }
      },
    },
  );

  const form = useForm<z.infer<typeof UserNameUpdateSchema>>({
    resolver: zodResolver(UserNameUpdateSchema),
    defaultValues: {
      id: user?.uid ?? 0,
      name: user?.name || "",
    },
  });

  const handleSubmit = form.handleSubmit(
    (data: z.infer<typeof UserNameUpdateSchema>) => {
      const formData = new FormData();
      formData.append("name", data.name);
      execute(formData);
    },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Họ và tên</CardTitle>
        <CardDescription>
          Cập nhật tên đầy đủ hiển thị trên tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="fullname-update-form" onSubmit={handleSubmit}>
          <input type="hidden" {...form.register("id")} />
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="name">Tên</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Nhập tên đầy đủ"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex min-h-12 w-full flex-col gap-2 border-t sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-center text-sm sm:text-left">
          Vui lòng nhập tên thật để tiện liên hệ
        </p>
        <div className="flex w-full justify-center sm:w-auto sm:justify-end">
          <Button
            type="submit"
            form="fullname-update-form"
            className="w-full sm:w-auto"
            size="sm"
            disabled={pending}
          >
            Lưu tên
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
