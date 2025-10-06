import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
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
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/images/login-image.jpg"
          alt="Image"
          height={1024}
          width={1024}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3]"
        />
      </div>
    </div>
  );
}
