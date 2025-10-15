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

        {/* Info Banner */}
        <div className="bg-muted/50 rounded-lg border p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-foreground font-semibold">
                Bảo mật thông tin
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Thông tin cá nhân của bạn được bảo vệ và mã hóa. Chúng tôi chỉ
                sử dụng dữ liệu này để cải thiện trải nghiệm dịch vụ và không
                chia sẻ với bên thứ ba.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
