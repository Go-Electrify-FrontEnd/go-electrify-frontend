"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { handleVerifyOTP, requestOtp } from "@/actions/login-actions";
import { Spinner } from "../ui/spinner";

interface OTPFormProps {
  email: string;
}

const initialState = {
  success: false,
  msg: "",
};

export function OTPForm({ email }: OTPFormProps) {
  const [otpVerifyState, otpVerifyAction, verifyActionPending] = useActionState(
    handleVerifyOTP,
    initialState,
  );

  // Resend countdown state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [isResendPending, startResend] = useTransition();

  useEffect(() => {
    if (!otpVerifyState) return;

    if (otpVerifyState.success) {
      if (otpVerifyState.msg) {
        toast.success("Đăng nhập thành công", {
          description: otpVerifyState.msg,
        });
      }
    } else {
      if (otpVerifyState.msg) {
        toast.error("Xác thực không thành công", {
          description: otpVerifyState.msg,
        });
      }
    }
  }, [otpVerifyState]);

  // Start countdown on mount and when restarted
  useEffect(() => {
    // Start only if secondsRemaining > 0
    if (secondsRemaining <= 0) return;
    const id = setInterval(() => {
      setSecondsRemaining((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [secondsRemaining]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  function handleResend() {
    if (!email) return;
    if (secondsRemaining > 0 || isResendPending) return;

    startResend(() => {
      requestOtp(email)
        .then((result) => {
          if (result.success) {
            toast.success(result.msg || "Mã OTP đã được gửi đến email của bạn");
            setSecondsRemaining(60);
          } else if (result.msg) {
            toast.error(result.msg);
          }
        })
        .catch((error) => {
          console.error("resend OTP error", error);
          toast.error("Lỗi kết nối. Vui lòng thử lại");
        });
    });
  }

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
              id="code"
              name="code"
              minLength={6}
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              className="gap-3"
              required
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
        <div className="flex w-full flex-col gap-3">
          <Button
            type="submit"
            className="h-12 w-full text-lg font-medium"
            disabled={verifyActionPending}
          >
            {verifyActionPending ? (
              <Spinner className="mr-2 h-5 w-5" />
            ) : (
              <Shield className="mr-2 h-5 w-5" />
            )}
            Xác thực OTP
          </Button>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className="text-primary text-sm underline disabled:opacity-60"
              onClick={handleResend}
              disabled={secondsRemaining > 0 || isResendPending}
            >
              Gửi lại mã OTP
            </button>
            {secondsRemaining > 0 ? (
              <span className="text-muted-foreground text-sm">
                Còn lại {formatTime(secondsRemaining)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}
