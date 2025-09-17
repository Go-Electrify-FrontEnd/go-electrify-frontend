"use client";

import * as React from "react";
import { PlusCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StationWithDistance } from "@/app/dashboard/find-stations/page";
import { ReservationForm } from "./reservation-form";
import { BookingSummary } from "./booking-summary";

// Mock car models data (to be passed to ReservationForm)
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

// Charging port standards (to be passed to ReservationForm)
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

interface CreateReservationButtonProps {
  stations: StationWithDistance[];
}

export default function CreateReservationButton({
  stations,
}: CreateReservationButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<"form" | "summary">(
    "form",
  );

  // Form state
  const [selectedStation, setSelectedStation] = React.useState<string>("");
  const [selectedCarModel, setSelectedCarModel] = React.useState<string>("");
  const [selectedChargingPort, setSelectedChargingPort] =
    React.useState<string>("");
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [startTime, setStartTime] = React.useState("");
  const [initialSoc, setInitialSoc] = React.useState("");

  // Step navigation handlers
  const handleContinue = () => {
    setCurrentStep("summary");
  };

  const handleBack = () => {
    setCurrentStep("form");
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    // Combine date and time to create full datetime
    const scheduledStart =
      selectedDate && startTime
        ? `${selectedDate.toISOString().split("T")[0]}T${startTime}:00`
        : "";

    // Handle form submission here
    console.log({
      stationId: selectedStation,
      carModelId: selectedCarModel,
      chargingPort: selectedChargingPort,
      scheduledStart,
      initialSoc: parseInt(initialSoc),
    });

    // Close dialog and reset form
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep("form");
    setSelectedStation("");
    setSelectedCarModel("");
    setSelectedChargingPort("");
    setSelectedDate(undefined);
    setStartTime("");
    setInitialSoc("");
  };

  // Get data objects for selected items
  const selectedStationData = stations.find(
    (s) => s.id.toString() === selectedStation,
  );

  const selectedCarModelData = carModels.find(
    (car) => car.id.toString() === selectedCarModel,
  );

  const selectedChargingPortData = chargingPorts.find(
    (port) => port.id === selectedChargingPort,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Tạo Đặt Chỗ Mới
        </Button>
      </DialogTrigger>
      <DialogContent className="no-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {currentStep === "form" ? "Tạo Đặt Chỗ Mới" : "Xác nhận đặt chỗ"}
          </DialogTitle>
          <DialogDescription>
            {currentStep === "form"
              ? "Chọn trạm sạc và thời gian cho đặt chỗ của bạn"
              : "Kiểm tra thông tin và xác nhận đặt chỗ"}
          </DialogDescription>
        </DialogHeader>

        {currentStep === "form" ? (
          <ReservationForm
            stations={stations}
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
            selectedCarModel={selectedCarModel}
            setSelectedCarModel={setSelectedCarModel}
            selectedChargingPort={selectedChargingPort}
            setSelectedChargingPort={setSelectedChargingPort}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            startTime={startTime}
            setStartTime={setStartTime}
            initialSoc={initialSoc}
            setInitialSoc={setInitialSoc}
            onCancel={handleCancel}
            onContinue={handleContinue}
          />
        ) : (
          <BookingSummary
            selectedStation={selectedStationData}
            selectedCarModel={selectedCarModelData}
            selectedChargingPort={selectedChargingPortData}
            selectedDate={selectedDate}
            startTime={startTime}
            initialSoc={initialSoc}
            onBack={handleBack}
            onConfirm={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
