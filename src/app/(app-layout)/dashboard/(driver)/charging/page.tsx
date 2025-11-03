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

  // Fetch current charging session
  const currentSession = await getCurrentSessionWithToken(token);

  // Handle existing session states
  if (currentSession) {
    const { status, id } = currentSession.session;

    // UNPAID session - redirect to payment page
    if (status === "UNPAID") {
      redirect("/dashboard/charging/payment/" + encodeURIComponent(id));
    }

    // RUNNING session - show redirect button to progress page
    if (status === "RUNNING") {
      return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Bắt đầu sạc
            </h1>
            <p className="text-muted-foreground">
              Bạn đang có phiên sạc đang hoạt động
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ZapIcon className="text-primary h-5 w-5" />
                Phiên sạc đang hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Phiên sạc đang chạy</AlertTitle>
                <AlertDescription>
                  Bạn có một phiên sạc đang hoạt động (ID: {id}). Vui lòng xem
                  tiến trình sạc hoặc hoàn thành phiên hiện tại trước khi bắt
                  đầu phiên mới.
                </AlertDescription>
              </Alert>

              <Button asChild className="w-full" size="lg">
                <Link href="/dashboard/charging/binding/progress">
                  <ZapIcon className="mr-2 h-4 w-4" />
                  Xem tiến trình sạc
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Other statuses (COMPLETED, TIMEOUT, FAILED, PAID, PENDING) - show warning but allow new session
    if (
      ["COMPLETED", "TIMEOUT", "FAILED", "PAID", "PENDING"].includes(status)
    ) {
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

  // No active session - show normal form
  return <StartChargingClient />;
}
