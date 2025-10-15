"use client";

import type { CarModel } from "@/lib/zod/vehicle-model/vehicle-model.types";
import type { ChargingPort } from "@/lib/zod/charging-port/charging-port.types";
import type { Reservation } from "@/lib/zod/reservation/reservation.types";
import type { Station } from "@/lib/zod/station/station.types";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface ReservationState {
  currentStep: "form" | "summary";
  selectedStation: string;
  selectedCarModel: string;
  selectedChargingPort: string;
  selectedDate?: Date;
  startTime: string;
  initialSoc: string;
  targetSoc: string;
  carModels: CarModel[];
}

// Context
interface ReservationContextType {
  // State values
  currentStep: "form" | "summary";
  selectedStation: string;
  selectedCarModel: string;
  selectedChargingPort: string;
  selectedDate?: Date;
  startTime: string;
  initialSoc: string;
  targetSoc: string;
  carModels: CarModel[];
  reservations: Reservation[];

  // Setters
  setCurrentStep: (step: "form" | "summary") => void;
  setSelectedStation: (station: string) => void;
  setSelectedCarModel: (carModel: string) => void;
  setSelectedChargingPort: (port: string) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setStartTime: (time: string) => void;
  setInitialSoc: (soc: string) => void;
  setTargetSoc: (soc: string) => void;
  setCarModels: (models: CarModel[]) => void;
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  resetForm: () => void;

  // Static data
  stations: Station[];
  chargingPorts: ChargingPort[];

  // Derived data
  selectedStationData: Station | undefined;
  selectedCarModelData: CarModel | undefined;
  selectedChargingPortData: ChargingPort | undefined;
}

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined,
);

// Provider component
interface ReservationProviderProps {
  children: ReactNode;
  stations: Station[];
  chargingPorts: ChargingPort[];
  reservations: Reservation[];
}

export function ReservationProvider({
  children,
  stations,
  chargingPorts,
  reservations,
}: ReservationProviderProps) {
  // useState for each piece of state
  const [currentStep, setCurrentStep] = useState<"form" | "summary">("form");
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [selectedChargingPort, setSelectedChargingPort] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [initialSoc, setInitialSoc] = useState("");
  const [targetSoc, setTargetSoc] = useState("");
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [reservationsState, setReservations] =
    useState<Reservation[]>(reservations);

  // Reset function
  const resetForm = () => {
    setCurrentStep("form");
    setSelectedStation("");
    setSelectedCarModel("");
    setSelectedChargingPort("");
    setSelectedDate(undefined);
    setStartTime("");
    setInitialSoc("");
    setTargetSoc("");
  };

  // Derived data
  const selectedStationData = stations.find(
    (s) => s.id.toString() === selectedStation,
  );

  const selectedCarModelData = carModels.find(
    (car) =>
      car.id !== undefined &&
      car.id !== null &&
      car.id.toString() === selectedCarModel,
  );

  const selectedChargingPortData = chargingPorts.find(
    (port) => port.id === selectedChargingPort,
  );

  return (
    <ReservationContext.Provider
      value={{
        // State values
        currentStep,
        selectedStation,
        selectedCarModel,
        selectedChargingPort,
        selectedDate,
        startTime,
        initialSoc,
        targetSoc,
        carModels,
        reservations: reservationsState,

        // Setters
        setCurrentStep,
        setSelectedStation,
        setSelectedCarModel,
        setSelectedChargingPort,
        setSelectedDate,
        setStartTime,
        setInitialSoc,
        setTargetSoc,
        setCarModels,
        setReservations,
        resetForm,

        // Static data
        stations,
        chargingPorts,

        // Derived data
        selectedStationData,
        selectedCarModelData,
        selectedChargingPortData,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

// Custom hook
export function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
}
