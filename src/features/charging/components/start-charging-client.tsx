"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useTransition } from "react";
import { InfoIcon, ZapIcon, Loader2, QrCode, Keyboard } from "lucide-react";
import { QRScanner } from "@/components/shared/qr-scanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  joinSchema,
  type JoinFormData,
} from "@/features/charging/schemas/join.request";
import { handleJoin } from "@/features/charging/services/charging-actions";

export default function StartChargingClient() {
  const [joinCode, setJoinCode] = useState("");
  const [activeTab, setActiveTab] = useState("qr");
  const [isPending, startTransition] = useTransition();

  const form = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      joinCode: "",
    },
  });

  const handleFormSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await handleJoin(null, formData);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    });
  };

  // Sync form value with joinCode state for QR scanner display
  useEffect(() => {
    const subscription = form.watch((value) => {
      setJoinCode(value.joinCode || "");
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
            Quét mã QR hoặc nhập mã tham gia từ trạm sạc
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Hướng dẫn</AlertTitle>
            <AlertDescription>
              <ol className="mt-2 list-inside list-decimal space-y-1">
                <li>Quét mã QR hoặc nhập mã tham gia từ trạm sạc</li>
                <li>Liên kết mã đặt chỗ của bạn với phiên sạc</li>
                <li>Nhập mức SOC mục tiêu</li>
                <li>Bắt đầu sạc và theo dõi tiến trình thời gian thực</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              if (!isPending) {
                setActiveTab(value);
              }
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="gap-2">
                <QrCode className="h-4 w-4" />
                Quét QR
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2">
                <Keyboard className="h-4 w-4" />
                Nhập thủ công
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="space-y-4">
              <QRScanner
                onScan={(data) => {
                  setJoinCode(data);
                  form.setValue("joinCode", data);
                  if (!isPending) {
                    setActiveTab("manual");
                  }
                }}
                onError={(error) => {
                  console.error("QR Scanner error:", error);
                }}
              />
              {joinCode && (
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Đã quét thành công</AlertTitle>
                  <AlertDescription>Mã: {joinCode}</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <form
                id="join-form"
                className="space-y-6"
                action={handleFormSubmit}
              >
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="joinCode"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="joinCode">Mã tham gia</FieldLabel>
                        <Input
                          {...field}
                          placeholder="Nhập mã tham gia"
                          className="text-lg"
                          disabled={isPending}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full"
                  size="lg"
                >
                  {isPending ? (
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
