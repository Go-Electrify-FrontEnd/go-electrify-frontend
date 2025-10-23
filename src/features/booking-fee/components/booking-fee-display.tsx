"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { BookingFee } from "@/lib/zod/booking-fee/booking-fee.types";
import { Percent, DollarSign, Info } from "lucide-react";

interface BookingFeeDisplayProps {
  bookingFee: BookingFee;
}

export function BookingFeeDisplay({ bookingFee }: BookingFeeDisplayProps) {
  const isPercent = bookingFee.type === "PERCENT";

  return (
    <Card className="border-2">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cấu Hình Hiện Tại</CardTitle>
            <CardDescription>
              Phí đặt chỗ đang được áp dụng trong hệ thống
            </CardDescription>
          </div>
          <Badge
            variant={isPercent ? "default" : "secondary"}
            className="text-xs"
          >
            {isPercent ? "Phần Trăm" : "Cố Định"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Main Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-xl ${
                  isPercent
                    ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700"
                    : "bg-gradient-to-br from-green-100 to-green-200 text-green-700"
                }`}
              >
                {isPercent ? (
                  <Percent className="h-8 w-8" />
                ) : (
                  <DollarSign className="h-8 w-8" />
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Loại phí
                </p>
                <p className="text-xl font-bold">
                  {isPercent ? "Phần Trăm" : "Phí Cố Định"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Giá trị
              </p>
              <p className="text-3xl font-bold">
                {isPercent
                  ? `${bookingFee.value}%`
                  : `${bookingFee.value.toLocaleString("vi-VN")}`}
              </p>
              {!isPercent && (
                <p className="text-muted-foreground text-xs">VND</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Fee Explanation */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="text-muted-foreground h-5 w-5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Cách tính phí:</p>
                <p className="text-muted-foreground text-sm">
                  {isPercent
                    ? `Phí ${bookingFee.value}% sẽ được tính trên tổng giá trị của mỗi đặt chỗ`
                    : `Mỗi đặt chỗ sẽ được tính thêm ${bookingFee.value.toLocaleString("vi-VN")} VND`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
