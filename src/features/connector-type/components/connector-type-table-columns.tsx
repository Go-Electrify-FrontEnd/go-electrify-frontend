"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActionsCell } from "./connector-type-actions";
import { ConnectorType } from "@/types/connector";

const formatPower = (power: number) => {
  return `${power} kW`;
};

export const columns: ColumnDef<ConnectorType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Tên Cổng Kết Nối",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô Tả",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-muted-foreground max-w-[200px] cursor-help truncate">
                {description}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[300px]">
              <p className="whitespace-normal">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
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
    id: "actions",
    header: "Hành Động",
    cell: ({ row }) => {
      const connectorType = row.original;
      return <ActionsCell connectorType={connectorType} />;
    },
  },
];
