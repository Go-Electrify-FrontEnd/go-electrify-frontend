import { LoginForm } from "@/features/auth/components/login-form";

export default async function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">Electrify</div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md space-y-6 text-center">
          <blockquote className="text-foreground text-2xl leading-relaxed font-medium italic">
            Chuyển đổi xanh và chuyển đổi số là xu thế tất yếu để phát triển bền
            vững.
          </blockquote>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-muted-foreground text-sm">
              Báo Điện tử Chính phủ
            </p>
          </div>
          <div className="pt-6">
            <div className="bg-primary mx-auto h-1 w-16 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
