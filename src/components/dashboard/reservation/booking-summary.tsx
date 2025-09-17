"use client";

import * as React from "react";
import {
  MapPin,
  Clock,
  Battery,
  Car,
  Zap,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StationWithDistance } from "@/app/dashboard/find-stations/page";

interface BookingSummaryProps {
  selectedStation: StationWithDistance | undefined;
  selectedCarModel: any;
  selectedChargingPort: any;
  selectedDate: Date | undefined;
  startTime: string;
  initialSoc: string;
  onBack: () => void;
  onConfirm: () => void;
}

export function BookingSummary({
  selectedStation,
  selectedCarModel,
  selectedChargingPort,
  selectedDate,
  startTime,
  initialSoc,
  onBack,
  onConfirm,
}: BookingSummaryProps) {
  // Mock estimated cost calculation
  const estimatedCost = 125750; // VND

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (date: Date, time: string) => {
    if (!date || !time) return "";
    return `${date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })} lúc ${time}`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold">Xác nhận đặt chỗ</h3>
        <p className="text-muted-foreground text-sm">
          Vui lòng kiểm tra thông tin trước khi xác nhận
        </p>
      </div>

      {/* Booking Details */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          {/* Station Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Trạm sạc
            </div>
            <div className="ml-6">
              <div className="font-medium">{selectedStation?.name}</div>
              <div className="text-muted-foreground text-sm">
                {selectedStation?.address}
              </div>
            </div>
          </div>

          {/* Car Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Car className="h-4 w-4" />
              Xe của bạn
            </div>
            <div className="ml-6">
              <div className="font-medium">
                {selectedCarModel?.brand} {selectedCarModel?.model}
              </div>
              <div className="text-muted-foreground text-sm">
                {selectedCarModel?.batteryCapacity}kWh
              </div>
            </div>
          </div>

          {/* Charging Port */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Cổng sạc
            </div>
            <div className="ml-6">
              <div className="font-medium">{selectedChargingPort?.name}</div>
              <div className="text-muted-foreground text-sm">
                {selectedChargingPort?.type}
              </div>
            </div>
          </div>

          {/* DateTime */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Thời gian
            </div>
            <div className="ml-6">
              <div className="font-medium">
                Bắt đầu:{" "}
                {selectedDate && formatDateTime(selectedDate, startTime)}
              </div>
            </div>
          </div>

          {/* Initial SoC */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Battery className="h-4 w-4" />
              SoC ban đầu
            </div>
            <div className="ml-6">
              <div className="font-medium">{initialSoc}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Estimate */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Chi phí dự kiến</span>
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(estimatedCost)}
            </span>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            * Chi phí có thể thay đổi dựa trên thời gian sạc thực tế
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Button onClick={onConfirm} className="flex-1">
          Xác nhận đặt chỗ
        </Button>
      </div>
    </div>
  );
}
