"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { useActionState, useEffect } from "react";
import { handleVerifyOTP } from "@/app/login/actions";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

interface OTPFormProps {
  email: string;
}

const initialState = {
  success: false,
  msg: "",
};

export function OTPForm({ email }: OTPFormProps) {
  const { push, refresh } = useRouter();
  const [otpVerifyState, otpVerifyAction] = useActionState(
    handleVerifyOTP,
    initialState,
  );

  useEffect(() => {
    if (otpVerifyState.success) {
      if (otpVerifyState.msg) {
        toast.success("Đăng nhập thành công", {
          description: otpVerifyState.msg,
        });

        refresh();
        push("/dashboard");
      }
    } else {
      if (otpVerifyState.msg) {
        toast.error("Xác thực không thành công", {
          description: otpVerifyState.msg,
        });
      }
    }
  }, [otpVerifyState]);

  return (
    <form
      action={otpVerifyAction}
      className="flex w-full max-w-md flex-col gap-8"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="bg-primary/10 mb-2 flex h-12 w-12 items-center justify-center rounded-full">
          <Shield className="text-primary h-6 w-6" />
        </div>
        <h1 className="text-3xl font-semibold">Xác thực OTP</h1>
        <p className="text-muted-foreground text-base text-balance">
          Nhập mã OTP 6 chữ số đã được gửi đến
          <br />
          <span className="text-foreground font-medium">{email}</span>
        </p>
      </div>
      <div className="flex flex-col items-center gap-8">
        <div className="flex w-full flex-col items-center gap-4">
          <Label htmlFor="otp" className="text-center text-base font-medium">
            Mã xác thực
          </Label>
          <input type="hidden" id="email" name="email" value={email} />
          <div className="flex w-full justify-center">
            <InputOTP
              id="otp"
              name="otp"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              className="gap-3"
            >
              <InputOTPGroup className="gap-3">
                <InputOTPSlot
                  index={0}
                  className="focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-lg border-2 text-xl font-semibold transition-all focus:ring-2"
                />
                <InputOTPSlot
                  index={1}
                  className="focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-lg border-2 text-xl font-semibold transition-all focus:ring-2"
                />
                <InputOTPSlot
                  index={2}
                  className="focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-lg border-2 text-xl font-semibold transition-all focus:ring-2"
                />
                <InputOTPSlot
                  index={3}
                  className="focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-lg border-2 text-xl font-semibold transition-all focus:ring-2"
                />
                <InputOTPSlot
                  index={4}
                  className="focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-lg border-2 text-xl font-semibold transition-all focus:ring-2"
                />
                <InputOTPSlot
                  index={5}
                  className="focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-lg border-2 text-xl font-semibold transition-all focus:ring-2"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-muted-foreground text-center text-sm">
            Nhập 6 chữ số bạn nhận được qua email
          </p>
        </div>
        <Button type="submit" className="h-12 w-full text-lg font-medium">
          <Shield className="mr-2 h-5 w-5" />
          Xác thực OTP
        </Button>
      </div>
    </form>
  );
}
