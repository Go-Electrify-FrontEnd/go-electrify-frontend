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
import { DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useReservation } from "@/contexts/reservation-context";

interface BookingSummaryProps {
  onBack: () => void;
  onConfirm: () => void;
}

export function BookingSummary({ onBack, onConfirm }: BookingSummaryProps) {
  const {
    selectedDate,
    startTime,
    initialSoc,
    targetSoc,
    selectedStationData,
    selectedCarModelData,
    selectedChargingPortData,
  } = useReservation();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Station Info */}
        {selectedStationData && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <h4 className="font-medium">{selectedStationData.name}</h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {selectedStationData.address}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Mô tả: {selectedStationData.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Car Model Info */}
        {selectedCarModelData && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Car className="text-primary mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <h4 className="font-medium">
                    {selectedCarModelData.modelName}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Max Power: {selectedCarModelData.maxPowerKw} kW
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Dung lượng pin: {selectedCarModelData.batteryCapacityKwh}{" "}
                    kWh
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charging Port Info */}
        {selectedChargingPortData && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Zap className="text-primary mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <h4 className="font-medium">
                    {selectedChargingPortData.name}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {selectedChargingPortData.type}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Công suất tối đa: {selectedChargingPortData.maxPower}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="text-primary mt-0.5 h-5 w-5" />
              <div className="flex-1">
                <h4 className="font-medium">Lịch sạc</h4>
                {selectedDate && (
                  <p className="text-muted-foreground text-sm">
                    Ngày: {format(selectedDate, "dd/MM/yyyy")}
                  </p>
                )}
                <p className="text-muted-foreground text-sm">
                  Giờ bắt đầu: {startTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Battery Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Battery className="text-primary mt-0.5 h-5 w-5" />
              <div className="flex-1">
                <h4 className="font-medium">Thông tin pin</h4>
                <p className="text-muted-foreground text-sm">
                  Mức pin hiện tại: {initialSoc}%
                </p>
                <p className="text-muted-foreground text-sm">
                  Mức pin mong muốn: {targetSoc}%
                </p>
                {initialSoc && targetSoc && (
                  <p className="text-primary text-sm font-medium">
                    Sạc thêm: {parseInt(targetSoc) - parseInt(initialSoc)}%
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Button onClick={onConfirm} className="flex-1">
          <Check className="mr-2 h-4 w-4" />
          Xác nhận đặt chỗ
        </Button>
      </DialogFooter>
    </div>
  );
}
