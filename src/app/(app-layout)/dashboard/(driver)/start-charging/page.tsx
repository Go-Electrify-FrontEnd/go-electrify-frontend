"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useActionState } from "react";
import { handleJoin } from "./action";
import { InfoIcon, ZapIcon, Loader2 } from "lucide-react";

export default function StartChargingPage() {
  const [state, action, pending] = useActionState(handleJoin, {
    success: false,
    msg: "",
    data: null,
  });

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Bắt đầu sạc</h1>
        <p className="text-muted-foreground">
          Nhập mã tham gia từ trạm sạc để bắt đầu phiên sạc
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ZapIcon className="text-primary h-5 w-5" />
            Tham gia phiên sạc
          </CardTitle>
          <CardDescription>
            Nhập mã tham gia được cung cấp tại trạm sạc
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Hướng dẫn</AlertTitle>
            <AlertDescription>
              <ol className="mt-2 list-inside list-decimal space-y-1">
                <li>Nhập mã tham gia từ trạm sạc</li>
                <li>Liên kết mã đặt chỗ của bạn với phiên sạc</li>
                <li>Nhập mức SOC mục tiêu</li>
                <li>Bắt đầu sạc và theo dõi tiến trình thời gian thực</li>
              </ol>
            </AlertDescription>
          </Alert>

          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="joinCode" className="text-sm font-medium">
                Mã tham gia
              </label>
              <Input
                id="joinCode"
                name="joinCode"
                placeholder="Nhập mã tham gia"
                className="text-lg"
                required
                disabled={pending}
              />
            </div>

            {state.msg && !state.success && (
              <Alert variant="destructive">
                <AlertDescription>{state.msg}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full"
              size="lg"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tham gia...
                </>
              ) : (
                <>
                  <ZapIcon className="mr-2 h-4 w-4" />
                  Tham gia phiên
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
