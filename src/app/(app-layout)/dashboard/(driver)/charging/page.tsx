import { getUser } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { getCurrentSessionWithToken } from "@/features/charging/services/session-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ZapIcon, AlertTriangle } from "lucide-react";
import Link from "next/link";
import StartChargingClient from "@/features/charging/components/start-charging-client";

export default async function StartChargingPage() {
  // Authenticate user
  const { user, token } = await getUser();
  if (!user || !token) {
    redirect("/login");
  }

  const currentSession = await getCurrentSessionWithToken(token);

  if (currentSession) {
    const { status, id } = currentSession.session;

    if (status === "UNPAID") {
      redirect("/dashboard/charging/payment/");
    }

    if (status === "PENDING" || status === "RUNNING") {
      redirect("/dashboard/charging/binding/progress");
    }

    if (["COMPLETED", "TIMEOUT", "FAILED", "PAID"].includes(status)) {
      return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Bắt đầu sạc
            </h1>
            <p className="text-muted-foreground">
              Nhập mã tham gia từ trạm sạc để bắt đầu phiên sạc
            </p>
          </div>

          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Phiên trước chưa hoàn tất</AlertTitle>
            <AlertDescription>
              Bạn có một phiên sạc với trạng thái &ldquo;{status}&rdquo; (ID:{" "}
              {id}). Vui lòng kiểm tra lịch sử sạc nếu cần thiết.
            </AlertDescription>
          </Alert>

          <StartChargingClient />
        </div>
      );
    }
  }

  return <StartChargingClient />;
}
