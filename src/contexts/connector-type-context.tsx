"use client";

import type { ConnectorType } from "@/lib/zod/connector-type/connector-type.types";
import { createContext, useContext, type ReactNode } from "react";

interface ConnectorTypeContextValue {
  connectorTypes: ConnectorType[];
}

const ConnectorTypeContext = createContext<ConnectorTypeContextValue | null>(
  null,
);

interface ConnectorTypeProviderProps {
  connectorTypes: ConnectorType[];
  children: ReactNode;
}

export function ConnectorTypeProvider({
  connectorTypes,
  children,
}: ConnectorTypeProviderProps) {
  return (
    <ConnectorTypeContext.Provider value={{ connectorTypes }}>
      {children}
    </ConnectorTypeContext.Provider>
  );
}

export function useConnectorTypes() {
  const context = useContext(ConnectorTypeContext);

  if (!context) {
    throw new Error(
      "useConnectorTypes must be used within a ConnectorTypeProvider",
    );
  }

  return context.connectorTypes;
}
