"use client";

import { Charger } from "@/features/chargers/schemas/charger.schema";
import { createContext, useContext, useState } from "react";

interface ChargerUpdateContextValue {
  setCharger: (charger: Charger | null) => void;
  setEditDialogOpen: (open: boolean) => void;
  charger: Charger | null;
  isEditDialogOpen: boolean;
  // Secret key dialog state
  secretKey: string;
  setSecretKey: (key: string) => void;
  showSecretDialog: boolean;
  setShowSecretDialog: (open: boolean) => void;
  secretDialogChargerId: string;
  setSecretDialogChargerId: (id: string) => void;
}

const ChargerUpdateContext = createContext<
  ChargerUpdateContextValue | undefined
>(undefined);

export function ChargerUpdateProvider({ children }: React.PropsWithChildren) {
  const [charger, setCharger] = useState<Charger | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  // Secret key dialog state
  const [secretKey, setSecretKey] = useState<string>("");
  const [showSecretDialog, setShowSecretDialog] = useState(false);
  const [secretDialogChargerId, setSecretDialogChargerId] = useState<string>("");

  return (
    <ChargerUpdateContext.Provider
      value={{
        setCharger,
        setEditDialogOpen,
        charger,
        isEditDialogOpen,
        secretKey,
        setSecretKey,
        showSecretDialog,
        setShowSecretDialog,
        secretDialogChargerId,
        setSecretDialogChargerId,
      }}
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
