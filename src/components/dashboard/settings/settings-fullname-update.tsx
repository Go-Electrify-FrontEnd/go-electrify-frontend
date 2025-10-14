"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/user-context";

export default function FullNameUpdate() {
  const { user } = useUser();
  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Họ và tên</CardTitle>
        <CardDescription>
          Cập nhật tên đầy đủ hiển thị trên tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          defaultValue={user?.name || ""}
          className="w-full max-w-md sm:max-w-lg"
        />
      </CardContent>
      <CardFooter className="flex h-12 w-full flex-col gap-2 border-t sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-center text-sm sm:text-left">
          Vui lòng nhập tên thật để tiện liên hệ
        </p>
        <div className="flex w-full justify-center sm:w-auto sm:justify-end">
          <Button className="w-full sm:w-auto" size="sm">
            Lưu
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
