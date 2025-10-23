"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { OTPForm } from "./login-otp-form";
import { handleLogin } from "../services/auth";

const initialState = {
  success: false,
  msg: "",
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState<string>("");
  const [loginState, loginAction, isPending] = useActionState(
    handleLogin,
    initialState,
  );
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (loginState.success) {
      toast("Email đã được gửi!", {
        description: loginState.msg,
      });
      setOtpSent(true);
    } else if (loginState.msg) {
      toast.error("Lỗi", {
        description: loginState.msg,
      });
    }
  }, [loginState]);

  if (otpSent) {
    return <OTPForm email={email} />;
  }

  return (
    <form
      action={loginAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl">Đăng nhập</h1>
        <p className="text-muted-foreground text-balance">
          Nhập thông tin của bạn ở bên dưới để tiếp tục
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label className="text-base" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            className="h-[45px]"
            placeholder="ten@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isPending}
          />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          <div className="text-base font-medium">
            {isPending ? "Đang gửi..." : "Đăng nhập"}
          </div>
        </Button>
        <div className="after:border-border relative text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Hoặc tiếp tục với
          </span>
        </div>
        <Button
          variant="outline"
          className="flex h-11 items-center justify-center gap-2 transition-colors hover:border-red-200 hover:bg-red-50"
          disabled
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-base font-medium">Đăng nhập với Google</span>
        </Button>
      </div>
    </form>
  );
}
