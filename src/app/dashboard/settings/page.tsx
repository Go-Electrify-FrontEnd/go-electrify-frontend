import UserInformation from "@/components/dashboard/settings/user-information";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockUser = {
  fullName: "Người dùng",
  email: "user@example.com",
  avatarUrl: "",
};

export default async function SettingsPage() {
  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start">
      <section className="lg:w-[20%]">
        <Card className="sticky top-24 w-full">
          <CardHeader className="items-center text-center">
            <CardTitle>Ảnh đại diện</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-28 w-28">
              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.fullName} />
              <AvatarFallback className="text-xl font-semibold">
                {mockUser.fullName
                  ?.split(" ")
                  .filter((word) => word.length > 0)
                  .map((word) => word[0]?.toUpperCase() ?? "")
                  .join("") || "ND"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-1">
              <p className="text-lg font-semibold">{mockUser.fullName}</p>
              <p className="text-muted-foreground text-sm">{mockUser.email}</p>
            </div>
          </CardContent>
          <CardFooter className="flex w-full flex-col gap-2">
            <Button variant="secondary" className="w-full">
              Thay đổi ảnh
            </Button>
            <Button variant="outline" className="w-full">
              Xóa ảnh hiện tại
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="flex-1 lg:w-[80%]">
        <UserInformation />
      </section>
    </div>
  );
}
