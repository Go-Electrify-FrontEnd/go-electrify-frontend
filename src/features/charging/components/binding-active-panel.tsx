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
import { useChannel } from "ably/react";
import {
  Activity,
  BatteryCharging,
  CheckCircle,
  Info,
  Play,
  Zap,
} from "lucide-react";
import { useBindingContext } from "../contexts/binding-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Message } from "ably";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import SectionContent from "@/components/shared/section-content";

export function BindingActivePanel() {
  const { booking, channelId } = useBindingContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const { push, refresh } = useRouter();

  const { publish } = useChannel(channelId, (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);

    if (message.name === "charging_complete") {
      toast.success("Phiên sạc đã hoàn tất!", {
        description: "Chuẩn bị tiến hành thanh toán.",
      });

      refresh();
      push("/dashboard/charging/success");
    } else if (message.name === "soc_update") {
      console.log("SOC update received:", JSON.stringify(message.data));

      setProgress(Number(message.data.soc));
    } else if (message.name === "car_information") {
      toast.error("Lỗi trong phiên sạc", {
        description: message.data?.message || "Đã xảy ra lỗi không xác định.",
      });
    }
  });

  const handlePublish = () => {
    publish("start_session", { targetSOC: booking.TargetSoc });
  };

  return (
    <SectionContent className="mt-8">
      {/* Stats Overview */}
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
              {progress}%
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
              {booking?.TargetSoc}%
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
              {progress}% / {booking?.TargetSoc}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progress} className="h-4" />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>Bắt đầu: {booking?.SocStart}%</span>
              <span>Hiện tại: {progress}%</span>
              <span>Mục tiêu: {booking?.TargetSoc}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Details */}
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
            {booking && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mã đặt chỗ:</span>
                  <span className="font-medium">{booking.BookingId}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID Phiên:</span>
                  <span className="font-medium">{booking.Id}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SOC Bắt Đầu:</span>
                  <span className="font-medium">{booking.SocStart}%</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SOC Mục Tiêu:</span>
                  <span className="font-medium">{booking.TargetSoc}%</span>
                </div>
              </div>
            )}
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
                value={booking?.TargetSoc}
                disabled={true}
                className="font-medium"
              />
              <p className="text-muted-foreground text-xs">
                Mức pin mong muốn khi kết thúc sạc
              </p>
            </div>

            <Button
              onClick={handlePublish}
              disabled={messages.length > 0}
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              {messages.length > 1 ? "Đang sạc..." : "Bắt đầu sạc"}
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
