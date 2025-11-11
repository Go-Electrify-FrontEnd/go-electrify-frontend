"use client";

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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import * as Ably from "ably";
import { Reservation } from "@/features/reservations/schemas/reservation.schema";
import { useServerAction } from "@/hooks/use-server-action";
import { handleBindBooking } from "@/features/charging/services/charging-actions";

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
  const [targetSOC, setTargetSOC] = useState("");
  const [isReloadingCarInfo, setIsReloadingCarInfo] = useState(false);

  const { state, execute, pending } = useServerAction(
    handleBindBooking,
    { success: false, msg: "", data: null },
    {
      onSuccess: (state) => {
        toast.success(state.msg);
      },
      onError: (state) => {
        toast.error(state.msg);
      },
    },
  );

  const incomingReservations = reservations.filter((reservation) => {
    return reservation.status === "CONFIRMED";
  });

  const { publish } = useChannel(channelId, (message) => {
    if (message.name === "car_information") {
      setCarInformation(message.data);
      setIsReloadingCarInfo(false);

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

  const currentSOC = carInformation
    ? (carInformation.currentCapacity / carInformation.maxCapacity) * 100
    : 0;

  const showPriceEstimate = targetSOC && parseFloat(targetSOC) > currentSOC;

  const energyNeeded = showPriceEstimate
    ? ((parseFloat(targetSOC) - currentSOC) / 100) * carInformation!.maxCapacity
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="sessionId" value={sessionId} />
          <input type="hidden" name="ablyToken" value={ablyToken} />
          <input type="hidden" name="channelId" value={channelId} />
          <input type="hidden" name="expiresAt" value={expiresAt} />

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Thông tin cần thiết</AlertTitle>
            <AlertDescription>
              Vui lòng cung cấp mã đặt chỗ và thông tin pin xe của bạn để tiếp
              tục.
            </AlertDescription>
          </Alert>

          <Field>
            <FieldLabel htmlFor="bookingCode">Mã đặt chỗ</FieldLabel>
            <Select name="bookingCode">
              <SelectTrigger>
                <SelectValue placeholder="Chọn mã đặt chỗ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Đặt chỗ</SelectLabel>
                  {incomingReservations.map((reservation) => (
                    <SelectItem key={reservation.id} value={reservation.code}>
                      {reservation.code}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>Mã đặt chỗ bạn đã tạo trước đó</FieldDescription>

            <Field>
              <FieldLabel htmlFor="currentSOC">SOC hiện tại (%)</FieldLabel>
              <div className="flex gap-2">
                <Input
                  name="currentSOC"
                  type="number"
                  value={currentSOC.toFixed(2)}
                  disabled={true}
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
            </Field>
          </Field>

          <Field>
            <FieldLabel htmlFor="targetSOC">SOC mục tiêu (%)</FieldLabel>
            <Input
              id="targetSOC"
              name="targetSOC"
              placeholder="VD: 80"
              type="number"
              min="0"
              max="100"
              required
              disabled={pending}
              value={targetSOC}
              onChange={(e) => setTargetSOC(e.target.value)}
            />
            <FieldDescription>Mức pin mong muốn sau khi sạc</FieldDescription>
          </Field>

          {showPriceEstimate && (
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
          )}

          {state.msg && !state.success && <FieldError>{state.msg}</FieldError>}

          <Button type="submit" disabled={pending} className="w-full" size="lg">
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
