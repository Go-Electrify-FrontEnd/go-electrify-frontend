"use client";

import * as React from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Battery,
  CalendarIcon,
  Car,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StationWithDistance } from "@/app/dashboard/find-stations/page";

// Mock car models data
const carModels = [
  {
    id: 1,
    brand: "Tesla",
    model: "Model 3",
    year: "2023",
    batteryCapacity: 75,
    supportedPorts: ["CCS2"],
  },
  {
    id: 2,
    brand: "Tesla",
    model: "Model Y",
    year: "2023",
    batteryCapacity: 82,
    supportedPorts: ["CCS2"],
  },
  {
    id: 3,
    brand: "VinFast",
    model: "VF8",
    year: "2023",
    batteryCapacity: 90,
    supportedPorts: ["CCS2"],
  },
  {
    id: 4,
    brand: "VinFast",
    model: "VF9",
    year: "2023",
    batteryCapacity: 123,
    supportedPorts: ["CCS2"],
  },
  {
    id: 5,
    brand: "Hyundai",
    model: "Ioniq 5",
    year: "2023",
    batteryCapacity: 77.4,
    supportedPorts: ["CCS2"],
  },
  {
    id: 6,
    brand: "Kia",
    model: "EV6",
    year: "2023",
    batteryCapacity: 77.4,
    supportedPorts: ["CCS2"],
  },
];

// Charging port standards
const chargingPorts = [
  {
    id: "CCS2",
    name: "CCS2 (Combined Charging System)",
    type: "DC Fast Charging",
    maxPower: "350kW",
  },
  {
    id: "CHAdeMO",
    name: "CHAdeMO",
    type: "DC Fast Charging",
    maxPower: "100kW",
  },
  {
    id: "Type2",
    name: "Type 2 (AC)",
    type: "AC Charging",
    maxPower: "22kW",
  },
];

// Mock existing bookings data
const existingBookings = [
  {
    id: 1,
    stationId: 1,
    date: "2025-09-17",
    startTime: "08:00",
    endTime: "10:30",
    customerName: "Nguyễn Văn A",
    carModel: "Tesla Model 3",
  },
  {
    id: 2,
    stationId: 1,
    date: "2025-09-17",
    startTime: "14:00",
    endTime: "16:00",
    customerName: "Trần Thị B",
    carModel: "VinFast VF8",
  },
  {
    id: 3,
    stationId: 2,
    date: "2025-09-17",
    startTime: "09:30",
    endTime: "11:00",
    customerName: "Lê Văn C",
    carModel: "Hyundai Ioniq 5",
  },
  {
    id: 4,
    stationId: 1,
    date: "2025-09-18",
    startTime: "07:00",
    endTime: "09:30",
    customerName: "Phạm Thị D",
    carModel: "Kia EV6",
  },
];

interface ReservationFormProps {
  stations: StationWithDistance[];
  selectedStation: string;
  setSelectedStation: (value: string) => void;
  selectedCarModel: string;
  setSelectedCarModel: (value: string) => void;
  selectedChargingPort: string;
  setSelectedChargingPort: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (value: Date | undefined) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  initialSoc: string;
  setInitialSoc: (value: string) => void;
  onCancel: () => void;
  onContinue: () => void;
}

export function ReservationForm({
  stations,
  selectedStation,
  setSelectedStation,
  selectedCarModel,
  setSelectedCarModel,
  selectedChargingPort,
  setSelectedChargingPort,
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  initialSoc,
  setInitialSoc,
  onCancel,
  onContinue,
}: ReservationFormProps) {
  const selectedStationData = stations.find(
    (s) => s.id.toString() === selectedStation,
  );

  // Get bookings for selected station and date
  const getBookingsForSelectedStationAndDate = () => {
    if (!selectedStation || !selectedDate) return [];

    const selectedDateString = selectedDate.toISOString().split("T")[0];
    return existingBookings.filter(
      (booking) =>
        booking.stationId.toString() === selectedStation &&
        booking.date === selectedDateString,
    );
  };

  const dayBookings = getBookingsForSelectedStationAndDate();

  return (
    <>
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Station Selection */}
        <div className="space-y-2">
          <Label htmlFor="station" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Chọn trạm sạc
          </Label>
          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger className="!h-18 !min-h-[3.5rem] w-full py-3">
              <SelectValue placeholder="Chọn trạm sạc..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] w-full">
              {stations.map((station) => (
                <SelectItem
                  key={station.id}
                  value={station.id.toString()}
                  className="data-[highlighted]:bg-accent min-h-[60px] px-3 py-3"
                >
                  <div className="flex w-full flex-col items-start gap-1 align-middle">
                    <div className="text-sm leading-tight font-medium break-words">
                      {station.name}
                    </div>
                    <div className="text-muted-foreground text-start text-xs leading-tight break-words whitespace-normal">
                      {station.address} • {station.type}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Station Info */}
        {selectedStationData && (
          <Card>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{selectedStationData.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    Loại: {selectedStationData.type}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Car Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="car-model" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Chọn xe của bạn
          </Label>
          <Select value={selectedCarModel} onValueChange={setSelectedCarModel}>
            <SelectTrigger className="!h-14 !min-h-[3.5rem] w-full py-3">
              <SelectValue placeholder="Chọn mẫu xe..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] w-full">
              {carModels.map((car) => (
                <SelectItem
                  key={car.id}
                  value={car.id.toString()}
                  className="data-[highlighted]:bg-accent min-h-[50px] px-3 py-2"
                >
                  <div className="flex w-full flex-col items-start gap-1">
                    <div className="text-sm leading-tight font-medium">
                      {car.brand} {car.model}
                    </div>
                    <div className="text-muted-foreground text-xs leading-tight">
                      {car.batteryCapacity}kWh
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Charging Port Selection */}
        {selectedCarModel && (
          <div className="space-y-2">
            <Label htmlFor="charging-port" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Cổng sạc
            </Label>
            <Select
              value={selectedChargingPort}
              onValueChange={setSelectedChargingPort}
            >
              <SelectTrigger className="!h-14 !min-h-[3.5rem] w-full py-3">
                <SelectValue placeholder="Chọn cổng sạc..." />
              </SelectTrigger>
              <SelectContent className="w-full">
                {chargingPorts
                  .filter((port) => {
                    const selectedCar = carModels.find(
                      (car) => car.id.toString() === selectedCarModel,
                    );
                    return selectedCar?.supportedPorts.includes(port.id);
                  })
                  .map((port) => (
                    <SelectItem
                      key={port.id}
                      value={port.id}
                      className="data-[highlighted]:bg-accent min-h-[50px] px-3 py-2"
                    >
                      <div className="flex w-full flex-col items-start gap-1">
                        <div className="text-sm leading-tight font-medium">
                          {port.name}
                        </div>
                        <div className="text-muted-foreground text-xs leading-tight">
                          {port.type} • Tối đa: {port.maxPower}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Date Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Chọn ngày
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? selectedDate.toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Bookings for Selected Date */}
        {selectedStation && selectedDate && (
          <Card>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">
                    Đặt chỗ ngày{" "}
                    {selectedDate.toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {dayBookings.length === 0 ? (
                  <div className="text-muted-foreground text-xs">
                    Không có đặt chỗ nào trong ngày này
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-muted/50 rounded-lg border p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="text-muted-foreground h-3 w-3" />
                            <span className="text-sm font-medium">
                              {booking.startTime}
                            </span>
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {booking.carModel}
                          </span>
                        </div>
                        <div className="text-muted-foreground mt-1 text-xs">
                          {booking.customerName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Selection - Only show when date is selected */}
        {selectedDate && (
          <div className="w-full">
            <div className="space-y-2">
              <Label htmlFor="start-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Giờ bắt đầu
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                className="w-full"
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Initial SoC */}
        <div className="space-y-2">
          <Label htmlFor="initial-soc" className="flex items-center gap-2">
            <Battery className="h-4 w-4" />
            SoC ban đầu (%)
          </Label>
          <Input
            id="initial-soc"
            type="number"
            min="0"
            max="100"
            placeholder="Ví dụ: 25"
            value={initialSoc}
            onChange={(e) => setInitialSoc(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          onClick={onContinue}
          disabled={
            !selectedStation ||
            !selectedCarModel ||
            !selectedChargingPort ||
            !selectedDate ||
            !startTime ||
            !initialSoc
          }
        >
          Tiếp tục
        </Button>
      </DialogFooter>
    </>
  );
}
