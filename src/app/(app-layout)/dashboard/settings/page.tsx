import FullNameUpdate from "@/components/dashboard/settings/settings-fullname-update";
import AvatarUpdate from "@/components/dashboard/settings/settings-avatar-update";
import SectionHeader from "@/components/dashboard/shared/section-header";
import { Separator } from "@/components/ui/separator";
import SettingsTheme from "@/components/dashboard/settings/settings-theme";

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

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Hiển thị</h3>
            <p className="text-muted-foreground text-sm">
              Tuỳ chỉnh giao diện và chế độ hiển thị của bạn
            </p>
          </div>
          <Separator />
          <div className="space-y-6">
            <SettingsTheme />
          </div>
        </div>

        {/* Additional sections can be added here */}
        {/* Example: Security, Notifications, Preferences */}
      </div>
    </div>
  );
}
