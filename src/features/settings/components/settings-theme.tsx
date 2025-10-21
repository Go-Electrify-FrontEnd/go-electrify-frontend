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
import { UserNameUpdateSchema } from "@/lib/zod/user/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function SettingsTheme() {
  const { user } = useUser();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Họ và tên</CardTitle>
        <CardDescription>
          Cập nhật tên đầy đủ hiển thị trên tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input></Input>
      </CardContent>
      <CardFooter className="flex h-12 w-full flex-col gap-2 border-t sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-center text-sm sm:text-left">
          Vui lòng nhập tên thật để tiện liên hệ
        </p>
        <div className="flex w-full justify-center sm:w-auto sm:justify-end">
          <Button
            type="submit"
            form="fullname-update-form"
            className="w-full sm:w-auto"
            size="sm"
          >
            Lưu tên
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
