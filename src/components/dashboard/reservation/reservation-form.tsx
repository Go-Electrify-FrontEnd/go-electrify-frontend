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
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { useReservation } from "@/contexts/reservation-context";

interface ReservationFormProps {
  onContinue: () => void;
}

export function ReservationForm({ onContinue }: ReservationFormProps) {
  const {
    selectedStation,
    selectedCarModel,
    selectedChargingPort,
    selectedDate,
    startTime,
    initialSoc,
    targetSoc,
    carModels,
    stations,
    chargingPorts,
    selectedStationData,
    selectedCarModelData,
    reservations,
    setSelectedStation,
    setSelectedCarModel,
    setSelectedChargingPort,
    setSelectedDate,
    setStartTime,
    setInitialSoc,
    setTargetSoc,
  } = useReservation();

  const [openStation, setOpenStation] = React.useState(false);
  const [openCarModel, setOpenCarModel] = React.useState(false);
  const [openChargingPort, setOpenChargingPort] = React.useState(false);

  const filteredReservations = React.useMemo(() => {
    if (!selectedStation || !selectedDate) {
      return [];
    }

    return reservations
      .filter((reservation) => {
        if (reservation.pointId.toString() !== selectedStation) {
          return false;
        }

        const start = new Date(reservation.scheduledStart);
        if (Number.isNaN(start.getTime())) {
          return false;
        }

        return isSameDay(start, selectedDate);
      })
      .sort((a, b) => {
        const startA = new Date(a.scheduledStart).getTime();
        const startB = new Date(b.scheduledStart).getTime();
        return startA - startB;
      });
  }, [reservations, selectedStation, selectedDate]);

  const statusLabels: Record<string, string> = {
    confirmed: "Đã xác nhận",
    pending: "Chờ xử lý",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const isFormValid = () => {
    return (
      selectedStation &&
      selectedCarModel &&
      selectedChargingPort &&
      selectedDate &&
      startTime &&
      initialSoc &&
      targetSoc
    );
  };

  return (
    <div className="space-y-6">
      {/* Station Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <Label className="text-sm font-medium">Chọn trạm sạc</Label>
        </div>
        <Popover open={openStation} onOpenChange={setOpenStation}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStation}
              className="w-full justify-between"
            >
              {selectedStation
                ? stations.find(
                    (station) => station.id.toString() === selectedStation,
                  )?.name
                : "Chọn trạm sạc"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Tìm kiếm trạm sạc..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy trạm sạc.</CommandEmpty>
                <CommandGroup>
                  {stations.map((station) => (
                    <CommandItem
                      key={station.id}
                      value={station.name}
                      onSelect={() => {
                        setSelectedStation(station.id.toString());
                        setOpenStation(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedStation === station.id.toString()
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {station.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Station Details */}
      {selectedStationData && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium">{selectedStationData.name}</h4>
              <p className="text-muted-foreground text-sm">
                {selectedStationData.address}
              </p>
              <p className="text-muted-foreground text-sm">
                Mô tả: {selectedStationData.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Car Model Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          <Label className="text-sm font-medium">Chọn mẫu xe</Label>
        </div>
        <Popover open={openCarModel} onOpenChange={setOpenCarModel}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCarModel}
              className="w-full justify-between"
              disabled={carModels.length === 0}
            >
              {selectedCarModel
                ? selectedCarModelData
                  ? `${selectedCarModelData.brand} ${selectedCarModelData.model}`
                  : "Chọn mẫu xe của bạn"
                : carModels.length === 0
                  ? "Đang tải mẫu xe..."
                  : "Chọn mẫu xe của bạn"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Tìm kiếm mẫu xe..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy mẫu xe.</CommandEmpty>
                <CommandGroup>
                  {carModels.map((car) => (
                    <CommandItem
                      key={car.id}
                      value={`${car.brand} ${car.model}`}
                      onSelect={() => {
                        setSelectedCarModel(car.id!.toString());
                        setOpenCarModel(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCarModel === car.id!.toString()
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {car.brand} {car.model}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Charging Port Selection */}
      {selectedCarModel && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <Label className="text-sm font-medium">Loại cổng sạc</Label>
          </div>
          <Popover open={openChargingPort} onOpenChange={setOpenChargingPort}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openChargingPort}
                className="w-full justify-between"
              >
                {selectedChargingPort
                  ? chargingPorts.find(
                      (port) => port.id === selectedChargingPort,
                    )?.name
                  : "Chọn loại cổng sạc"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Tìm kiếm cổng sạc..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy cổng sạc.</CommandEmpty>
                  <CommandGroup>
                    {chargingPorts.map((port) => (
                      <CommandItem
                        key={port.id}
                        value={port.name}
                        onSelect={() => {
                          setSelectedChargingPort(port.id);
                          setOpenChargingPort(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedChargingPort === port.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div>
                          <div>{port.name}</div>
                          <div className="text-muted-foreground text-xs">
                            {port.type} - {port.maxPower}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Date Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <Label className="text-sm font-medium">Chọn ngày</Label>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Chọn ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setStartTime("");
              }}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {selectedStation && selectedDate && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Đặt chỗ trong ngày đã chọn
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Các đặt chỗ tại trạm này trong ngày{" "}
              {format(selectedDate, "dd/MM/yyyy")}.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => {
                const start = new Date(reservation.scheduledStart);
                const end = new Date(reservation.scheduledEnd);
                const startLabel = Number.isNaN(start.getTime())
                  ? "--:--"
                  : format(start, "HH:mm");
                const endLabel = Number.isNaN(end.getTime())
                  ? "--:--"
                  : format(end, "HH:mm");
                const statusLabel =
                  statusLabels[reservation.status.toLowerCase()] ??
                  reservation.status;

                return (
                  <div
                    key={reservation.id}
                    className="bg-muted/40 border-border/60 rounded-lg border p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {startLabel} - {endLabel}
                      </span>
                      <span className="text-muted-foreground text-xs tracking-wide uppercase">
                        {statusLabel}
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      SOC: {reservation.initialSoc}% • Loại: {reservation.type}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm">
                Chưa có đặt chỗ nào cho ngày này tại trạm đã chọn.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <Label className="text-sm font-medium">Chọn giờ bắt đầu</Label>
          </div>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full"
            placeholder="HH:MM"
          />
        </div>
      )}

      {/* Battery Level Input */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4" />
            <Label className="text-sm font-medium">Mức pin hiện tại (%)</Label>
          </div>
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="20"
            value={initialSoc}
            onChange={(e) => setInitialSoc(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4" />
            <Label className="text-sm font-medium">Mức pin mong muốn (%)</Label>
          </div>
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="80"
            value={targetSoc}
            onChange={(e) => setTargetSoc(e.target.value)}
          />
        </div>
      </div>

      {/* Form Actions */}
      <DialogFooter className="gap-2">
        <Button
          onClick={onContinue}
          disabled={!isFormValid()}
          className="w-full"
        >
          Xử lý đặt chỗ
        </Button>
      </DialogFooter>
    </div>
  );
}
