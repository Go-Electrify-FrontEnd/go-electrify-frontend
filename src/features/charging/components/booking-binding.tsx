"use client";

import { Input } from "@/components/ui/input";
import { handleBindBooking } from "../services/charging-actions";
import { useActionState, useEffect, useState } from "react";
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
import { CheckCircleIcon, Loader2, ZapIcon, InfoIcon } from "lucide-react";
import { Reservation } from "@/lib/zod/reservation/reservation.schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBindingContext } from "../contexts/binding-context";
import { useChannel } from "ably/react";

interface CarInformation {
  currentCapacity: number;
  maxCapacity: number;
  timestamp: string;
}

interface BookingBindingProps {
  reservations: Reservation[];
  sessionId: string;
  channelName: string;
}

export function BookingBinding({
  sessionId,
  reservations,
}: BookingBindingProps) {
  const [state, action, pending] = useActionState(handleBindBooking, {
    success: false,
    msg: "",
    data: null,
  });

  const incomingReservations = reservations.filter((reservation) => {
    return reservation.status == "CONFIRMED";
  });

  const { setBooking, setCurrentStep, channelId } = useBindingContext();
  const [carInformation, setCarInformation] = useState<CarInformation | null>(
    null,
  );
  const [targetSOC, setTargetSOC] = useState("");

  const { publish } = useChannel(channelId, (message) => {
    if (message.name === "car_information") {
      setCarInformation(message.data);
    }
  });

  useEffect(() => {
    // Publish load_car_information message on component mount
    publish("load_car_information", {});
  }, [publish]);

  useEffect(() => {
    if (state.success) {
      if (state.data) {
        console.log("Binding successful:", JSON.stringify(state.data));
        setBooking(state.data);

        setCurrentStep("charging");
      }
    }
  }, [state.success]);

  const currentSOC = carInformation
    ? (carInformation.currentCapacity / carInformation.maxCapacity) * 100
    : 0;

  const showPriceEstimate = targetSOC && parseFloat(targetSOC) > currentSOC;

  const energyNeeded = showPriceEstimate
    ? ((parseFloat(targetSOC) - currentSOC) / 100) * carInformation!.maxCapacity
    : 0;

  const estimatedPrice = energyNeeded * 4000;

  if (!carInformation) {
    return (
      <div className="mx-auto flex h-[80vh] max-w-2xl flex-col items-center justify-center space-y-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Đang tải thông tin xe...</p>
      </div>
    );
  }

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
        <form action={action} className="space-y-6">
          <input type="hidden" name="sessionId" value={sessionId} />

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
              <Input
                name="currentSOC"
                type="number"
                value={currentSOC.toFixed(2)}
                disabled={true}
              />
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
                Ước tính dựa trên {energyNeeded.toFixed(2)} kWh cần sạc (4000
                VND/kWh)
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
