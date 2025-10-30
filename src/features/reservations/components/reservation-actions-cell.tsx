"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReservationDetails } from "../services/reservations-api";
import { ReservationCancelDialog } from "./reservation-cancel-dialog";

interface ActionsCellProps {
  reservation: ReservationDetails;
}

export const ActionsCell = ({ reservation }: ActionsCellProps) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="hover:bg-muted h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-semibold">
            Hành động
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(reservation.id.toString())
            }
            className="cursor-pointer"
          >
            Sao chép ID
          </DropdownMenuItem>
          {(reservation.status === "CONFIRMED" ||
            reservation.status === "PENDING") && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setCancelDialogOpen(true)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                Hủy đặt chỗ
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ReservationCancelDialog
        reservation={reservation}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
      />
    </>
  );
};
