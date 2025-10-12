"use client";

import { createContext, useContext, useState } from "react";
import { ConnectorType } from "@/types/connector";

interface ConnectorTypeUpdateContextValue {
  setConnectorType: (connectorType: ConnectorType | null) => void;
  setEditDialogOpen: (open: boolean) => void;
  connectorType: ConnectorType | null;
  isEditDialogOpen: boolean;
}

const ConnectorTypeUpdateContext = createContext<
  ConnectorTypeUpdateContextValue | undefined
>(undefined);

export function ConnectorTypeUpdateProvider({
  children,
}: React.PropsWithChildren) {
  const [connectorType, setConnectorType] = useState<ConnectorType | null>(
    null,
  );
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <ConnectorTypeUpdateContext.Provider
      value={{
        setConnectorType,
        setEditDialogOpen,
        connectorType,
        isEditDialogOpen,
      }}
    >
      {children}
    </ConnectorTypeUpdateContext.Provider>
  );
}

export function useConnectorTypeUpdate() {
  const context = useContext(ConnectorTypeUpdateContext);
  if (!context) {
    throw new Error(
      "useConnectorTypeUpdate must be used within ConnectorTypeUpdateProvider",
    );
  }
  return context;
}
