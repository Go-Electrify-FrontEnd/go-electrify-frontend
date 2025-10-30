"use client";

import { Charger } from "@/features/chargers/schemas/charger.schema";
import { createContext, useContext, useState } from "react";

interface ChargerUpdateContextValue {
  setCharger: (charger: Charger | null) => void;
  setEditDialogOpen: (open: boolean) => void;
  charger: Charger | null;
  isEditDialogOpen: boolean;
}

const ChargerUpdateContext = createContext<
  ChargerUpdateContextValue | undefined
>(undefined);

export function ChargerUpdateProvider({ children }: React.PropsWithChildren) {
  const [charger, setCharger] = useState<Charger | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <ChargerUpdateContext.Provider
      value={{ setCharger, setEditDialogOpen, charger, isEditDialogOpen }}
    >
      {children}
    </ChargerUpdateContext.Provider>
  );
}

export function useChargerUpdate() {
  const ctx = useContext(ChargerUpdateContext);
  if (!ctx)
    throw new Error(
      "useChargerUpdate must be used within ChargerUpdateProvider",
    );
  return ctx;
}
