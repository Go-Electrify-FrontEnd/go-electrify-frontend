"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrencyVND, formatDateTime } from "@/lib/formatters";
import { ReservationDetails } from "../services/reservations-api";
import { ActionsCell } from "./reservation-actions-cell";

const getStatusVariant = (status: string) => {
  switch (String(status).toUpperCase()) {
    case "CONFIRMED":
      return "default";
    case "PENDING":
      return "secondary";
    case "CONSUMED":
    case "COMPLETED":
      return "outline";
    case "CANCELED":
      return "destructive";
    default:
      return "secondary";
  }
};

const translateStatus = (status: string) => {
  switch (String(status).toUpperCase()) {
    case "CONFIRMED":
      return "Đã xác nhận";
    case "PENDING":
      return "Chờ xử lý";
    case "CONSUMED":
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELED":
      return "Đã hủy";
    case "EXPIRED":
      return "Đã hết hạn";
    default:
      return status;
  }
};

interface ReservationSimpleProps {
  reservation: ReservationDetails;
}

export function ReservationSimple({ reservation }: ReservationSimpleProps) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">#{reservation.code}</span>
          <Badge variant={getStatusVariant(reservation.status)}>
            {translateStatus(reservation.status)}
          </Badge>
        </div>
        <ActionsCell reservation={reservation} />
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Trạm: </span>
          {reservation.stationName}
        </div>
        <div>
          <span className="font-medium">Mẫu xe: </span>
          {reservation.vehicleModelName}
        </div>
        <div>
          <span className="font-medium">Thời gian: </span>
          {formatDateTime(reservation.scheduledStart)}
        </div>
        <div>
          <span className="font-medium">Thời gian kết thúc: </span>
          {(() => {
            const endTime = new Date(reservation.scheduledStart);
            endTime.setMinutes(endTime.getMinutes() + 60);
            return formatDateTime(endTime);
          })()}
        </div>
        <div>
          <span className="font-medium">Cổng sạc: </span>
          {reservation.connectorTypeName}
        </div>
        <div>
          <span className="font-medium">Chi phí: </span>
          <span className="font-semibold text-green-600">
            {formatCurrencyVND(Number(reservation.estimatedCost || 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
