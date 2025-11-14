"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import SectionContent from "@/components/section-content";
import {
  Activity,
  BatteryCharging,
  CheckCircle,
  Info,
  Loader2,
  Play,
  Zap,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import * as Ably from "ably";
import type { Message } from "ably";
import type { CurrentChargingSession } from "@/features/charging/schemas/current-session.schema";

interface CarInformation {
  currentCapacity: number;
  maxCapacity: number;
  timestamp: string;
}

interface ChargingProgressClientProps {
  sessionId: number;
  ablyToken: string;
  channelId: string;
  expiresAt: string;
  sessionData: CurrentChargingSession | null;
  errorMessage?: string | null;
}

function ChargingProgressInner({
  sessionData,
  channelId,
  errorMessage,
}: {
  sessionData: ChargingProgressClientProps["sessionData"];
  channelId: string;
  errorMessage?: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [carInformation, setCarInformation] = useState<CarInformation | null>(
    null,
  );
  const [progress, setProgress] = useState<number>(sessionData?.socStart || 0);
  const [isStarted, setStarted] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const { push, refresh } = useRouter();

  // Derived state - countdown is active when countdown > 0
  const isCountdownActive = countdown > 0;

  // 5-second countdown on mount
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle redirect when charging is complete
  useEffect(() => {
    if (shouldRedirect) {
      // Use window.location for more reliable navigation
      window.location.href = "/dashboard/charging/payment";
    }
  }, [shouldRedirect]);

  const { publish } = useChannel(channelId, (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);

    if (message.name === "charging_complete") {
      toast.success("Phiên sạc đã hoàn tất!", {
        description: "Chuẩn bị tiến hành thanh toán.",
      });

      // Trigger redirect via state
      setShouldRedirect(true);
    } else if (message.name === "soc_update") {
      const newSOC = Number(message.data.soc);
      setProgress(newSOC);

      // Also update car information if available
      if (carInformation) {
        const newCapacity = (newSOC / 100) * carInformation.maxCapacity;
        setCarInformation({
          ...carInformation,
          currentCapacity: newCapacity,
        });
      }

      if (!isStarted) {
        toast.success("Phiên sạc đã bắt đầu!", {
          description: `Mức pin hiện tại: ${newSOC}%`,
        });

        setStarted(true);
      }
    } else if (message.name === "car_information") {
      setCarInformation(message.data);
      console.log("Received car information:", message.data);
    }
  });

  // Load car information on mount
  useEffect(() => {
    publish("load_car_information", {});
  }, []);

  // Calculate current SOC from car information
  const currentSOC = carInformation
    ? (carInformation.currentCapacity / carInformation.maxCapacity) * 100
    : progress;

  const handlePublish = () => {
    if (!sessionData) return;
    publish("start_session", { targetSOC: sessionData.targetSoc });
  };

  if (!sessionData) {
    return (
      <SectionContent className="mt-8">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Không tìm thấy dữ liệu phiên</AlertTitle>
          <AlertDescription>
            {errorMessage ||
              "Không thể tải thông tin phiên sạc. Vui lòng thử lại sau."}
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => push("/dashboard/charging")}>
            Quay lại trang sạc
          </Button>
          <Button onClick={() => refresh()}>Thử lại</Button>
        </div>
      </SectionContent>
    );
  }

  const socStart = sessionData.socStart;
  const targetSOC = sessionData.targetSoc;
  const socRange = Math.max(targetSOC - socStart, 0.0001);
  const progressToTarget =
    targetSOC <= socStart
      ? 100
      : Math.min(Math.max(((currentSOC - socStart) / socRange) * 100, 0), 100);

  if (!carInformation) {
    return (
      <SectionContent className="mt-8">
        <div className="mx-auto flex h-[60vh] max-w-2xl flex-col items-center justify-center space-y-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Đang tải thông tin xe...</p>
        </div>
      </SectionContent>
    );
  }

  return (
    <SectionContent className="mt-8">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Trạng Thái</CardDescription>
            <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
              Đang Sạc
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Activity className="size-4" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Phiên đang hoạt động <Zap className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Theo dõi tiến trình sạc pin
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>SOC Hiện Tại</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {currentSOC.toFixed(2)}%
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <BatteryCharging className="size-4" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Đang cập nhật <Activity className="size-4" />
            </div>
            <div className="text-muted-foreground">Mức pin hiện tại của xe</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>SOC Mục Tiêu</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {sessionData.targetSoc}%
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <CheckCircle className="size-4" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Mục tiêu đặt trước <CheckCircle className="size-4" />
            </div>
            <div className="text-muted-foreground">Mức pin mong muốn</div>
          </CardFooter>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BatteryCharging className="h-4 w-4 sm:h-5 sm:w-5" />
            Tiến Trình Sạc
          </CardTitle>
          <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
            Theo dõi mức pin trong thời gian thực
          </CardDescription>
          <CardAction>
            <Badge variant="default" className="text-[10px] sm:text-xs">
              {currentSOC.toFixed(2)}% / {sessionData.targetSoc}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progressToTarget} className="h-4" />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>Bắt đầu: {socStart}%</span>
              <span>Hiện tại: {currentSOC.toFixed(2)}%</span>
              <span>Mục tiêu: {sessionData.targetSoc}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              Thông Tin Đặt Chỗ
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
              Đặt chỗ đã được liên kết thành công với phiên sạc
            </CardDescription>
            <CardAction>
              <Badge variant="default" className="text-[10px] sm:text-xs">
                Đã liên kết
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mã đặt chỗ:</span>
                <span className="font-medium">{sessionData.bookingId}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID Phiên:</span>
                <span className="font-medium">{sessionData.id}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SOC Bắt Đầu:</span>
                <span className="font-medium">{sessionData.socStart}%</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SOC Mục Tiêu:</span>
                <span className="font-medium">{sessionData.targetSoc}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Play className="h-4 w-4 sm:h-5 sm:w-5" />
              Điều Khiển Sạc
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:mt-1.5 sm:text-sm">
              Quản lý phiên sạc của bạn
            </CardDescription>
            <CardAction>
              <Badge
                variant={messages.length > 1 ? "secondary" : "default"}
                className="text-[10px] sm:text-xs"
              >
                {messages.length > 1 ? "Đang sạc" : "Sẵn sàng"}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="targetSOC" className="text-sm font-medium">
                SOC Mục Tiêu (%)
              </label>
              <Input
                id="targetSOC"
                type="number"
                value={sessionData.targetSoc}
                disabled={true}
                className="font-medium"
              />
              <p className="text-muted-foreground text-xs">
                Mức pin mong muốn khi kết thúc sạc
              </p>
            </div>

            <Button
              onClick={handlePublish}
              disabled={isStarted || isCountdownActive}
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              {isCountdownActive
                ? `Vui lòng chờ (${countdown}s)`
                : "Bắt đầu sạc"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Hướng dẫn</AlertTitle>
        <AlertDescription>
          Nhấn &ldquo;Bắt đầu sạc&rdquo; để khởi động phiên sạc. Hệ thống sẽ tự
          động theo dõi và cập nhật tiến trình sạc của bạn. Phiên sạc sẽ tự động
          dừng khi đạt SOC mục tiêu.
        </AlertDescription>
      </Alert>
    </SectionContent>
  );
}

export function ChargingProgressClient({
  sessionId,
  ablyToken,
  channelId,
  expiresAt,
  sessionData,
  errorMessage,
}: ChargingProgressClientProps) {
  const realtimeClient = useMemo(
    () =>
      new Ably.Realtime({
        token: ablyToken,
        autoConnect: true,
      }),
    [ablyToken],
  );

  console.log("Current session token: ", ablyToken);
  console.log("Current channelId: ", channelId);
  console.log("Session ID:", sessionData?.id);
  console.log("Attempting to connect to channel:", channelId);
  console.log(
    "Expected channel for session:",
    sessionData ? `ge:session:${sessionData.id}` : "N/A",
  );
  return (
    <AblyProvider client={realtimeClient}>
      <ChannelProvider channelName={channelId}>
        <ChargingProgressInner
          sessionData={sessionData}
          channelId={channelId}
          errorMessage={errorMessage}
        />
      </ChannelProvider>
    </AblyProvider>
  );
}
