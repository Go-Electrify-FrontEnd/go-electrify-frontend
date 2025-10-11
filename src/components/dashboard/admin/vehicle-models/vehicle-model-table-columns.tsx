"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CarModel } from "@/types/car";
import { VehicleModelActionsCell } from "./vehicle-model-actions";

const formatPower = (power: number) => {
  return `${power} kW`;
};

const formatBattery = (capacity: number) => {
  return `${capacity} kWh`;
};

export const columns: ColumnDef<CarModel>[] = [
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
    header: "Tên Mẫu Xe",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("modelName")}</div>
    ),
  },
  {
    accessorKey: "maxPowerKw",
    header: "Công Suất Tối Đa",
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
    header: "Dung Lượng Pin",
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
    header: "Loại Cổng Kết Nối",
    cell: ({ row }) => {
      const connectorTypeIds = row.getValue("connectorTypeIds") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {connectorTypeIds.map((id) => (
            <Badge key={id} variant="outline" className="font-mono">
              CT#{id}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Hành Động",
    cell: ({ row }) => {
      const carModel = row.original;
      return <VehicleModelActionsCell carModel={carModel} />;
    },
  },
];
