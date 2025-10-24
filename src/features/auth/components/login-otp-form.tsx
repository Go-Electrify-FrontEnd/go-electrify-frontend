"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useServerAction } from "@/hooks/use-server-action";
import { handleVerifyOTP, requestOtp } from "../services/login-actions";

interface OTPFormProps {
  email: string;
}

const initialState = {
  success: false,
  msg: "",
};

const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Mã OTP phải có 6 chữ số"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

export function OTPForm({ email }: OTPFormProps) {
  const router = useRouter();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [isResendPending, startResend] = useTransition();

  const { execute, pending } = useServerAction(handleVerifyOTP, initialState, {
    onSettled: (result) => {
      if (result.success) {
        toast.success("Đăng nhập thành công", {
          description: result.msg,
        });

        router.refresh();
        router.push("/dashboard");
      } else if (result.msg) {
        toast.error("Xác thực không thành công", {
          description: result.msg,
        });
      }
    },
  });

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
    mode: "all",
  });

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prevSeconds) => {
        const newSeconds = prevSeconds - 1;
        return newSeconds <= 0 ? 0 : newSeconds;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [secondsRemaining]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  async function handleResend() {
    if (!email) return;
    if (secondsRemaining > 0 || isResendPending) return;

    startResend(async () => {
      try {
        const result = await requestOtp(email);
        if (result.success) {
          toast.success(result.msg || "Mã OTP đã được gửi đến email của bạn");
          setSecondsRemaining(60);
        } else if (result.msg) {
          toast.error(result.msg);
        }
      } catch (error) {
        console.error("resend OTP error", error);
        toast.error("Lỗi kết nối. Vui lòng thử lại");
      }
    });
  }

  const handleSubmit = form.handleSubmit((data: OTPFormValues) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("code", data.code);
    execute(formData);
  });

  return (
    <form
      onSubmit={handleSubmit}
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
          <FieldGroup>
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor="code"
                    className="text-center text-base font-medium"
                  >
                    Mã xác thực
                  </FieldLabel>
                  <input type="hidden" id="email" name="email" value={email} />
                  <div className="flex w-full justify-center">
                    <InputOTP
                      {...field}
                      minLength={6}
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      className="gap-3"
                      aria-invalid={fieldState.invalid}
                      disabled={pending}
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
                  {fieldState.invalid && (
                    <p className="text-destructive mt-2 text-center text-sm">
                      {fieldState.error?.message}
                    </p>
                  )}
                  <p className="text-muted-foreground text-center text-sm">
                    Nhập 6 chữ số bạn nhận được qua email
                  </p>
                </Field>
              )}
            />
          </FieldGroup>
        </div>
        <div className="flex w-full flex-col gap-3">
          <Button
            type="submit"
            className="h-12 w-full text-lg font-medium"
            disabled={pending}
          >
            {pending ? (
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
