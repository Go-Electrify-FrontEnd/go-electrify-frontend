"use client";

import { useEffect, useState } from "react";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Station } from "@/app/dashboard/find-stations/page";
import { ReservationForm } from "./reservation-form";
import { BookingSummary } from "./booking-summary";
import { getCarModels } from "@/lib/actions/car-models";
import { ChargingPort, Reservation } from "@/types/reservation";
import {
  ReservationProvider,
  useReservation,
} from "@/contexts/reservation-context";

const chargingPorts: ChargingPort[] = [
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
  stations: Station[];
  reservations: Reservation[];
}

function ReservationDialog() {
  const { currentStep, setCarModels, setCurrentStep, resetForm } =
    useReservation();

  useEffect(() => {
    const loadCarModels = async () => {
      try {
        const models = await getCarModels();
        setCarModels(models);
      } catch (error) {
        console.error("Failed to load car models:", error);
      }
    };

    loadCarModels();
  }, [setCarModels]);

  const handleContinue = () => {
    setCurrentStep("summary");
  };

  const handleBack = () => {
    setCurrentStep("form");
  };

  const handleSubmit = () => {
    resetForm();
  };

  return (
    <>
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
        <ReservationForm onContinue={handleContinue} />
      ) : (
        <BookingSummary onBack={handleBack} onConfirm={handleSubmit} />
      )}
    </>
  );
}

export default function CreateReservationButton({
  stations,
  reservations,
}: CreateReservationButtonProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <ReservationProvider
      stations={stations}
      chargingPorts={chargingPorts}
      reservations={reservations}
    >
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Tạo Đặt Chỗ Mới
          </Button>
        </DialogTrigger>
        <DialogContent className="no-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-md">
          <ReservationDialog />
        </DialogContent>
      </Dialog>
    </ReservationProvider>
  );
}
