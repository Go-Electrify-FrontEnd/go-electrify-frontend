import FullNameUpdate from "@/components/dashboard/settings/settings-fullname-update";
import AvatarUpdate from "@/components/dashboard/settings/settings-avatar-update";

export default async function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col gap-6 md:gap-8">
      {/* Page Header */}

      {/* Main Content Area */}
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary h-1 w-10 rounded-full"></div>
          <div>
            <h2 className="text-foreground text-xl font-semibold">
              Thông tin cá nhân
            </h2>
            <p className="text-muted-foreground text-sm">
              Cập nhật thông tin hồ sơ của bạn
            </p>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          <AvatarUpdate />
          <FullNameUpdate />
        </div>
      </div>
    </div>
  );
}
