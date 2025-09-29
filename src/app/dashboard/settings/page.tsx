import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FullNameUpdate from "@/components/dashboard/settings/fullname-update";
import AvatarUpdate from "@/components/dashboard/settings/avatar-update";

const mockUser = {
  fullName: "Người dùng",
  email: "user@example.com",
  avatarUrl: "",
};

export default async function SettingsPage() {
  return (
    <div className="container">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin tài khoản và tùy chỉnh trải nghiệm của bạn.
        </p>
      </div>

      <Separator className="mb-8" />

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
        {/* Left Sidebar - Navigation/Menu (for future) */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <Card className="p-4">
              <h3 className="font-semibold">Danh mục</h3>
              <nav className="space-y-2">
                <div className="bg-primary/10 text-primary rounded-md px-3 py-2 text-sm font-medium">
                  Hồ sơ cá nhân
                </div>
                <div className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer rounded-md px-3 py-2 text-sm">
                  Bảo mật
                </div>
                <div className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer rounded-md px-3 py-2 text-sm">
                  Thông báo
                </div>
              </nav>
            </Card>
          </div>
        </div>

        {/* Right Content - Settings Forms */}
        <div className="lg:col-span-8">
          <div className="space-y-6">
            <div>
              <div className="space-y-4">
                <AvatarUpdate />
                <FullNameUpdate />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
