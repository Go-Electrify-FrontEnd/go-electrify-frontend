"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerAction } from "@/hooks/use-server-action";
import {
  completePaymentFormSchema,
  type CompletePaymentFormValues,
} from "@/features/charging/schemas/complete-payment.request";
import {
  completeSessionPayment,
  type CompletePaymentActionState,
} from "@/features/charging/services/charging-actions";
import type { CurrentChargingSession } from "@/features/charging/schemas/current-session.schema";
import {
  Controller,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  formatCurrencyVND,
  formatDate,
} from "@/lib/formatters";
import {
  Loader2,
  CreditCard,
  Wallet,
  Layers,
  Calendar,
  Battery,
  Zap,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PaymentClientProps {
  sessionId: string;
  sessionData: CurrentChargingSession;
}

const initialState: CompletePaymentActionState = {
  success: false,
  msg: "",
  suggestion: null,
  code: null,
};

export default function PaymentClient({
  sessionId,
  sessionData,
}: PaymentClientProps) {
  const router = useRouter();

  const form = useForm<CompletePaymentFormValues>({
    resolver: zodResolver(completePaymentFormSchema),
    defaultValues: {
      method: "WALLET",
    },
  });

  const { state, execute, pending } = useServerAction(
    completeSessionPayment,
    initialState,
    {
      onSettled: (result) => {
        if (result.success) {
          toast.success("Thanh toán thành công", {
            description: result.msg,
          });
          form.reset({ method: "WALLET" });
          router.push(`/dashboard/wallet`);
        } else if (result.msg) {
          toast.error("Thanh toán không thành công", {
            description: result.msg,
          });
        }
      },
    },
  );

  const onSubmit: SubmitHandler<CompletePaymentFormValues> = (data) => {
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("method", data.method);
    execute(formData);
  };

  const hasError = useMemo(
    () => Boolean(state.msg) && !state.success,
    [state.msg, state.success],
  );

  const sessionDuration = useMemo(() => {
    if (!sessionData.startedAt || !sessionData.endedAt) return "N/A";
    const start = new Date(sessionData.startedAt);
    const end = new Date(sessionData.endedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, [sessionData.startedAt, sessionData.endedAt]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Thanh toán phiên sạc
          </h1>
          <Badge variant="destructive" className="text-sm">
            CHƯA THANH TOÁN
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Hoàn tất thanh toán cho phiên sạc #{sessionId}
        </p>
      </div>

      {hasError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>{state.code || "Thanh toán thất bại"}</AlertTitle>
          <AlertDescription className="space-y-2">
            <span>{state.msg}</span>
            {state.suggestion && <p>{state.suggestion}</p>}
          </AlertDescription>
        </Alert>
      )}

      {/* Session Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-primary h-5 w-5" />
            Thông tin phiên sạc
          </CardTitle>
          <CardDescription>Chi tiết về phiên sạc của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Thời gian bắt đầu</p>
                <p className="text-muted-foreground text-sm">
                  {formatDate(sessionData.startedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Thời gian kết thúc</p>
                <p className="text-muted-foreground text-sm">
                  {sessionData.endedAt
                    ? formatDate(sessionData.endedAt)
                    : "Chưa kết thúc"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Battery className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">SOC cuối cùng</p>
                <p className="text-muted-foreground text-sm">
                  {sessionData.finalSoc ? `${sessionData.finalSoc}%` : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Zap className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Năng lượng tiêu thụ</p>
                <p className="text-muted-foreground text-sm">
                  {sessionData.energyKwh.toFixed(2)} kWh
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Thời gian sạc</p>
                <p className="text-muted-foreground text-sm">
                  {sessionDuration}
                </p>
              </div>
            </div>

            <div className="bg-primary/5 flex items-start gap-3 rounded-lg border p-4">
              <DollarSign className="text-primary mt-0.5 h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Tổng chi phí</p>
                <p className="text-primary text-lg font-semibold">
                  {formatCurrencyVND(sessionData.cost)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted mt-4 rounded-lg p-4">
            <div className="flex items-start gap-2 text-sm">
              <div className="space-y-1">
                <p className="font-medium">Thông tin bổ sung</p>
                <p className="text-muted-foreground">
                  Mã đặt chỗ:{" "}
                  <span className="font-mono">#{sessionData.bookingId}</span>
                </p>
                <p className="text-muted-foreground">
                  Mã trạm sạc:{" "}
                  <span className="font-mono">#{sessionData.chargerId}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="text-primary h-5 w-5" />
            Thông tin thanh toán
          </CardTitle>
          <CardDescription>
            Chọn phương thức thanh toán để hoàn tất giao dịch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="method"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="method">
                      Phương thức thanh toán
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={pending}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Chọn phương thức" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WALLET">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Ví điện tử
                          </div>
                        </SelectItem>
                        <SelectItem value="SUBSCRIPTION">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            Gói đăng ký
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Alert className="bg-muted">
              <DollarSign className="h-4 w-4" />
              <AlertTitle>Tổng chi phí cần thanh toán</AlertTitle>
              <AlertDescription className="text-lg font-semibold">
                {formatCurrencyVND(sessionData.cost)}
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-muted-foreground text-sm">
                Chọn phương thức thanh toán phù hợp để hoàn tất giao dịch.
              </div>
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Xác nhận thanh toán
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
