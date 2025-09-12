import { LoginForm } from "@/components/auth/login-form";
import AppLogo from "@/components/shared/logo";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <AppLogo className="text-2xl" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:flex lg:flex-col lg:justify-center lg:items-center lg:p-12">
        <div className="max-w-md text-center space-y-6">
          <blockquote className="text-2xl italic font-medium leading-relaxed text-foreground">
            The green transition and digital transformation are inevitable
            trends for sustainable development.
          </blockquote>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Socialist Republic of Viet Nam – Government News
            </p>
          </div>
          <div className="pt-6">
            <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
