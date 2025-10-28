"use client";

import * as Ably from "ably";
import { useSearchParams } from "next/navigation";
import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import { Input } from "@/components/ui/input";
import { handleBindBooking } from "../action";
import { useActionState, useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  Loader2,
  ZapIcon,
  BatteryChargingIcon,
  MessageSquareIcon,
  InfoIcon,
} from "lucide-react";
import {
  ChargingProgressChart,
  ChargingDataPoint,
} from "@/components/shared/charging-progress-chart";

export default function JoinPage() {
  const params = useSearchParams();

  const ablyToken = params.get("ablyToken");
  const channelId = params.get("channelId");
  const sessionId = params.get("sessionId");
  const expiresAt = params.get("expiresAt");

  if (!ablyToken || !channelId || !sessionId || !expiresAt) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Lỗi: Thiếu thông tin bắt buộc</AlertTitle>
          <AlertDescription>
            Vui lòng kiểm tra URL và đảm bảo tất cả thông tin cần thiết đều có
            sẵn.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Phiên sạc
            </h1>
            <p className="text-muted-foreground">
              Mã phiên: <code className="text-sm">{sessionId}</code>
            </p>
          </div>

          <BookingBinding sessionId={sessionId} channelName={channelId} />
        </div>
      </ChannelProvider>
    </AblyProvider>
  );
}

function MessageView({ message }: { message: Ably.Message }) {
  const dataText =
    typeof message.data === "string"
      ? message.data
      : JSON.stringify(message.data, null, 2);

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <div className="text-muted-foreground mb-1 text-xs">
          {message.name || "message"}
          {message.timestamp && (
            <span className="ml-2">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
        <pre className="bg-transparent font-mono text-sm whitespace-pre-wrap text-green-300">
          {dataText}
        </pre>
      </div>
    </div>
  );
}

function BookingBinding({
  sessionId,
  channelName,
}: {
  sessionId: string;
  channelName: string;
}) {
  const [state, action, pending] = useActionState(handleBindBooking, {
    success: false,
    msg: "",
    data: null,
  });

  const [messages, setMessages] = useState<Ably.Message[]>([]);
  const [chargingData, setChargingData] = useState<ChargingDataPoint[]>([]);
  const [targetSOC, setTargetSOC] = useState<number>(80);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const { publish, channel } = useChannel(channelName, (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);

    // Parse charging data if message contains it
    try {
      if (message.data && typeof message.data === "object") {
        const data = message.data as any;
        if ("currentSOC" in data && "energyKwh" in data && "at" in data) {
          const chargingPoint: ChargingDataPoint = {
            currentSOC: Number(data.currentSOC),
            powerKw: data.powerKw !== null ? Number(data.powerKw) : null,
            energyKwh: Number(data.energyKwh),
            at: data.at,
          };
          setChargingData((prev) => [...prev, chargingPoint]);
        }
      }
    } catch (error) {
      console.error("Error parsing charging data:", error);
    }
  });

  const handlePublish = () => {
    publish("start_session", { targetSOC }).catch((err) => {
      console.error("Error publishing message", err);
    });
  };

  useEffect(() => {
    // scroll to the newest message whenever messages change
    const el = terminalRef.current;
    if (!el) return;
    // use setTimeout to ensure DOM updated
    const id = setTimeout(() => {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } catch (e) {
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
    return () => clearTimeout(id);
  }, [messages.length]);

  if (state.success) {
    return (
      <div className="space-y-6">
        {/* Charging Progress Chart */}
        {chargingData.length > 0 && (
          <ChargingProgressChart
            data={chargingData}
            targetSOC={state.data?.TargetSoc || targetSOC}
          />
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    Đã liên kết đặt chỗ
                  </CardTitle>
                  <Badge variant="default">Hoạt động</Badge>
                </div>
                <CardDescription>
                  Đặt chỗ của bạn đã được liên kết thành công với phiên sạc này
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.data && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mã đặt chỗ:</span>
                      <span className="font-medium">
                        {state.data.BookingId}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        SOC ban đầu:
                      </span>
                      <span className="font-medium">
                        {state.data.SocStart}%
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        SOC mục tiêu:
                      </span>
                      <span className="font-medium">
                        {state.data.TargetSoc}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="targetSOC" className="text-sm font-medium">
                    Cập nhật SOC mục tiêu (%)
                  </label>
                  <Input
                    id="targetSOC"
                    type="number"
                    value={targetSOC}
                    disabled={true}
                  />
                  <p className="text-muted-foreground text-xs">
                    Mức pin mong muốn khi kết thúc sạc
                  </p>
                </div>

                <Button
                  onClick={handlePublish}
                  disabled={pending}
                  className="w-full"
                  size="lg"
                >
                  <BatteryChargingIcon className="mr-2 h-4 w-4" />
                  Bắt đầu sạc
                </Button>
              </CardContent>
            </Card>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Bước tiếp theo</AlertTitle>
              <AlertDescription>
                Nhập SOC mục tiêu mong muốn và nhấn "Bắt đầu sạc" để bắt đầu
                phiên sạc. Theo dõi tiến trình trong biểu đồ và bảng tin nhắn.
              </AlertDescription>
            </Alert>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareIcon className="h-5 w-5" />
                Tin nhắn thời gian thực
              </CardTitle>
              <CardDescription>Cập nhật trực tiếp từ trạm sạc</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={terminalRef}
                className="max-h-[500px] overflow-y-auto rounded bg-black/90 p-3 font-mono text-sm text-green-300"
              >
                {messages.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center text-sm">
                    Chưa có tin nhắn. Bắt đầu sạc để xem cập nhật.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((msg: Ably.Message, i: number) => (
                      <div
                        key={msg.id || i}
                        className="border-b border-transparent pb-2 last:pb-0"
                      >
                        <MessageView message={msg} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
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

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="bookingCode" className="text-sm font-medium">
                Mã đặt chỗ
              </label>
              <Input
                id="bookingCode"
                name="bookingCode"
                placeholder="Nhập mã đặt chỗ"
                required
                disabled={pending}
              />
              <p className="text-muted-foreground text-xs">
                Mã đặt chỗ bạn đã tạo trước đó
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="targetSOC" className="text-sm font-medium">
                SOC mục tiêu (%)
              </label>
              <Input
                id="targetSOC"
                name="targetSOC"
                placeholder="VD: 80"
                type="number"
                min="0"
                max="100"
                required
                disabled={pending}
              />
              <p className="text-muted-foreground text-xs">
                Mức pin mong muốn sau khi sạc
              </p>
            </div>
          </div>

          {state.msg && !state.success && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>{state.msg}</AlertDescription>
            </Alert>
          )}

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
