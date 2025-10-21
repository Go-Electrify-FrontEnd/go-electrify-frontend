import FullNameUpdate from "@/features/settings/components/settings-fullname-update";
import AvatarUpdate from "@/features/settings/components/settings-avatar-update";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col gap-6 md:gap-8">
      <div className="mx-auto w-full max-w-5xl space-y-8 p-12 px-4 pb-8 md:px-6">
        {/* Profile Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Hồ sơ cá nhân</h3>
            <p className="text-muted-foreground text-sm">
              Cập nhật ảnh đại diện và thông tin hiển thị của bạn
            </p>
          </div>
          <Separator />
          <div className="space-y-6">
            <AvatarUpdate />
            <FullNameUpdate />
          </div>
        </div>
      </div>
    </div>
  );
}
