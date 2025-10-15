"use client";

import { createContext, useContext, useState } from "react";
import type { CarModel } from "@/lib/zod/vehicle-model/vehicle-model.types";

interface VehicleModelActionContextValue {
  setVehicleModel: (vehicleModel: CarModel | null) => void;
  setEditDialogOpen: (open: boolean) => void;
  vehicleModel: CarModel | null;
  isEditDialogOpen: boolean;
}

const VehicleModelActionContext = createContext<
  VehicleModelActionContextValue | undefined
>(undefined);

export function VehicleModelUpdateProvider({
  children,
}: React.PropsWithChildren) {
  const [vehicleModel, setVehicleModel] = useState<CarModel | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <VehicleModelActionContext.Provider
      value={{
        setVehicleModel,
        setEditDialogOpen,
        vehicleModel,
        isEditDialogOpen,
      }}
    >
      {children}
    </VehicleModelActionContext.Provider>
  );
}

export function useVehicleModelUpdate() {
  const context = useContext(VehicleModelActionContext);
  if (!context) {
    throw new Error(
      "useVehicleModelUpdate must be used within VehicleModelsClientWrapper",
    );
  }
  return context;
}

export { VehicleModelActionContext };
