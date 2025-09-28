"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Station } from "@/app/dashboard/find-stations/page";
import { CarModel, ChargingPort } from "@/types/reservation";

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
}

export function ReservationProvider({
  children,
  stations,
  chargingPorts,
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
    (car) => car.id.toString() === selectedCarModel,
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
