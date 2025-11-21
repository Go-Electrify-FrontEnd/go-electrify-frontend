"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  CheckCircleIcon,
  Loader2,
  ZapIcon,
  InfoIcon,
  RefreshCwIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import * as Ably from "ably";
import { Reservation } from "@/features/reservations/schemas/reservation.schema";
import { useServerAction } from "@/hooks/use-server-action";
import { handleBindBooking } from "@/features/charging/services/charging-actions";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import {
  bookingBindingSchema,
  type BookingBindingFormData,
} from "../schemas/booking-binding.schema";

interface CarInformation {
  currentCapacity: number;
  maxCapacity: number;
  timestamp: string;
}

interface BookingBindingClientProps {
  sessionId: string;
  ablyToken: string;
  channelId: string;
  expiresAt: string;
  reservations: Reservation[];
  pricePerKwh: number;
}

function BookingBindingInner({
  sessionId,
  channelId,
  ablyToken,
  expiresAt,
  reservations,
  pricePerKwh,
}: BookingBindingClientProps) {
  const [carInformation, setCarInformation] = useState<CarInformation | null>(
    null,
  );
  const [isReloadingCarInfo, setIsReloadingCarInfo] = useState(false);

  const { state, execute, pending } = useServerAction(
    handleBindBooking,
    { success: false, msg: "", data: null },
    {
      onSuccess: (state) => {
        toast.success(state.msg);
        form.reset();
      },
      onError: (state) => {
        toast.error(state.msg);
      },
    },
  );

  const form = useForm<BookingBindingFormData>({
    resolver: zodResolver(bookingBindingSchema),
    defaultValues: {
      sessionId,
      ablyToken,
      channelId,
      expiresAt,
      bookingCode: "",
      currentSOC: 0,
      targetSOC: 0,
    },
  });

  const incomingReservations = reservations.filter((reservation) => {
    return reservation.status === "CONFIRMED";
  });

  const { publish } = useChannel(channelId, (message) => {
    if (message.name === "car_information") {
      setCarInformation(message.data);
      setIsReloadingCarInfo(false);

      const soc =
        (message.data.currentCapacity / message.data.maxCapacity) * 100;
      form.setValue("currentSOC", soc);

      console.log("Received car information:", message.data);
    }
  });

  const handleReloadCarInfo = () => {
    setIsReloadingCarInfo(true);
    publish("load_car_information", {});
  };

  useEffect(() => {
    publish("load_car_information", {});
  }, []);

  const currentSOC = form.watch("currentSOC");
  const targetSOC = form.watch("targetSOC");

  const showPriceEstimate = targetSOC > 0 && targetSOC > currentSOC;

  const energyNeeded = showPriceEstimate
    ? ((targetSOC - currentSOC) / 100) * carInformation!.maxCapacity
    : 0;

  const estimatedPrice = pricePerKwh * energyNeeded;

  if (!carInformation) {
    return (
      <div className="mx-auto flex h-[80vh] max-w-2xl flex-col items-center justify-center space-y-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Đang tải thông tin xe...</p>
      </div>
    );
  }

  const onSubmit: SubmitHandler<BookingBindingFormData> = (data) => {
    const formData = new FormData();
    formData.append("sessionId", data.sessionId);
    formData.append("ablyToken", data.ablyToken);
    formData.append("channelId", data.channelId);
    formData.append("expiresAt", data.expiresAt);
    formData.append("bookingCode", data.bookingCode);
    formData.append("currentSOC", data.currentSOC.toString());
    formData.append("targetSOC", data.targetSOC.toString());
    execute(formData);
  };

  return (
    <Card className="mx-auto mt-8 max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ZapIcon className="text-primary h-5 w-5" />
          Liên kết đặt chỗ
        </CardTitle>
        <CardDescription>
          Nhập mã đặt chỗ của bạn để kết nối với phiên sạc này
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="booking-binding-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Thông tin cần thiết</AlertTitle>
            <AlertDescription>
              Vui lòng cung cấp mã đặt chỗ và thông tin pin xe của bạn để tiếp
              tục.
            </AlertDescription>
          </Alert>

          <Controller
            control={form.control}
            name="bookingCode"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="bookingCode">Mã đặt chỗ</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={pending}
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Chọn mã đặt chỗ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Đặt chỗ</SelectLabel>
                      {incomingReservations.map((reservation) => (
                        <SelectItem
                          key={reservation.id}
                          value={reservation.code}
                        >
                          {reservation.code}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Mã đặt chỗ bạn đã tạo trước đó
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="currentSOC"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="currentSOC">SOC hiện tại (%)</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    {...field}
                    type="number"
                    value={field.value.toFixed(2)}
                    disabled={true}
                    aria-invalid={fieldState.invalid}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleReloadCarInfo}
                    disabled={isReloadingCarInfo}
                    title="Tải lại thông tin xe"
                  >
                    <RefreshCwIcon
                      className={`h-4 w-4 ${isReloadingCarInfo ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
                <FieldDescription>Mức pin hiện tại của xe</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="targetSOC"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="targetSOC">SOC mục tiêu (%)</FieldLabel>
                <Input
                  {...field}
                  id="targetSOC"
                  placeholder="VD: 80"
                  type="number"
                  min="0"
                  max="100"
                  disabled={pending}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  Mức pin mong muốn sau khi sạc
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {showPriceEstimate && (
            <>
              <Field>
                <FieldLabel>Ước tính chi phí</FieldLabel>
                <Input
                  type="text"
                  value={`${estimatedPrice.toLocaleString()} VND`}
                  disabled={true}
                />
                <FieldDescription>
                  Ước tính dựa trên {energyNeeded.toFixed(2)} kWh cần sạc (
                  {pricePerKwh.toLocaleString()} VND/kWh)
                </FieldDescription>
              </Field>

              <Alert
                variant="default"
                className="border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/30"
              >
                <InfoIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <AlertTitle className="font-semibold text-orange-900 dark:text-orange-100">
                  Lưu ý về giá
                </AlertTitle>
                <AlertDescription className="font-medium text-orange-800 dark:text-orange-200">
                  Giá hiển thị chỉ mang tính chất tham khảo và ước tính. Số tiền
                  thực tế bạn phải thanh toán sẽ phụ thuộc vào lượng điện năng
                  thực tế đã sạc.
                </AlertDescription>
              </Alert>
            </>
          )}

          {state.msg && !state.success && <FieldError>{state.msg}</FieldError>}

          <Button
            form="booking-binding-form"
            type="submit"
            disabled={pending}
            className="w-full"
            size="lg"
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang liên kết...
              </>
            ) : (
              <>
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                Liên kết đặt chỗ
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function BookingBindingClient({
  sessionId,
  ablyToken,
  channelId,
  expiresAt,
  reservations,
  pricePerKwh,
}: BookingBindingClientProps) {
  const realtimeClient = useMemo(
    () =>
      new Ably.Realtime({
        token: ablyToken,
        autoConnect: true,
      }),
    [ablyToken],
  );

  return (
    <AblyProvider client={realtimeClient}>
      <ChannelProvider channelName={channelId}>
        <BookingBindingInner
          sessionId={sessionId}
          channelId={channelId}
          ablyToken={ablyToken}
          expiresAt={expiresAt}
          reservations={reservations}
          pricePerKwh={pricePerKwh}
        />
      </ChannelProvider>
    </AblyProvider>
  );
}
