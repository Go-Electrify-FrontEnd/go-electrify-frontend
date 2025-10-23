"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BookingFee } from "@/lib/zod/booking-fee/booking-fee.types";
import { Percent, DollarSign } from "lucide-react";

interface BookingFeeDisplayProps {
  bookingFee: BookingFee;
}

export function BookingFeeDisplay({ bookingFee }: BookingFeeDisplayProps) {
  const isPercent = bookingFee.type === "PERCENT";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                isPercent ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
              }`}
            >
              {isPercent ? (
                <Percent className="h-6 w-6" />
              ) : (
                <DollarSign className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Loại phí hiện tại
              </p>
              <p className="text-lg font-semibold">
                {isPercent ? "Phần Trăm" : "Phí Cố Định"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm font-medium">
              Giá trị
            </p>
            <p className="text-2xl font-bold">
              {isPercent
                ? `${bookingFee.value}%`
                : `${bookingFee.value.toLocaleString("vi-VN")} VND`}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Badge variant={isPercent ? "default" : "secondary"}>
            {isPercent
              ? `Tính ${bookingFee.value}% trên giá trị đặt chỗ`
              : `Thu cố định ${bookingFee.value.toLocaleString("vi-VN")} VND/đặt chỗ`}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
