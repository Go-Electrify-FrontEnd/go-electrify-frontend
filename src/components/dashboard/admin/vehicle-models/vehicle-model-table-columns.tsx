"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { CarModel } from "@/lib/zod/vehicle-model/vehicle-model.types";
import { VehicleModelActionsCell } from "./vehicle-model-actions";
import { useConnectorTypes } from "@/contexts/connector-type-context";

const formatPower = (power: number) => `${power} kW`;
const formatBattery = (capacity: number) => `${capacity} kWh`;

function ConnectorTypeNames({ ids }: { ids: string[] }) {
  const connectorTypesAvailable = useConnectorTypes();

  const connectorTypeById = React.useMemo(() => {
    const m = new Map<number, string>();
    connectorTypesAvailable.forEach((ct) => m.set(ct.id, ct.name));
    return m;
  }, [connectorTypesAvailable]);

  if (!ids || ids.length === 0)
    return <div className="text-muted-foreground">N/A</div>;

  const rendered = ids
    .map((id) => {
      const num = Number(id);
      return connectorTypeById.get(num) ?? `CT${id}`;
    })
    .join(", ");

  return <div className="text-muted-foreground">{rendered}</div>;
}

export const vehicleModelTableColumns = (
  // t parameter kept for compatibility but translations are inlined
  t: (key: string) => string,
): ColumnDef<CarModel>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "modelName",
    header: "Mẫu xe",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("modelName")}</div>
    ),
  },
  {
    accessorKey: "maxPowerKw",
    header: "Công suất tối đa",
    cell: ({ row }) => {
      const power = row.getValue("maxPowerKw") as number;
      return (
        <Badge variant="secondary" className="font-mono">
          {formatPower(power)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "batteryCapacityKwh",
    header: "Dung lượng pin",
    cell: ({ row }) => {
      const capacity = row.getValue("batteryCapacityKwh") as number;
      return (
        <Badge variant="outline" className="font-mono">
          {formatBattery(capacity)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "connectorTypeIds",
    header: "Loại cổng",
    cell: ({ row }) => {
      const connectorTypeIds = row.getValue("connectorTypeIds") as string[];
      return <ConnectorTypeNames ids={connectorTypeIds} />;
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const carModel = row.original;
      return <VehicleModelActionsCell carModel={carModel} />;
    },
  },
];
