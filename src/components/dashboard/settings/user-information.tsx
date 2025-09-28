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

export default function UserInformation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tên đầy đủ</CardTitle>
        <CardDescription>Thay đổi tên đầy đủ của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          className="w-full max-w-md sm:max-w-lg"
          placeholder="Nhập tên đầy đủ"
        />
      </CardContent>
      <CardFooter className="flex w-full flex-col gap-2 border-t sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-center text-sm sm:text-left">
          Hãy chọn tên thật của bạn vì hoá đơn sẽ được in theo tên này.
        </p>
        <div className="flex w-full justify-center py-2 sm:w-auto sm:justify-end">
          <Button className="w-full sm:w-auto">Lưu thay đổi</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
