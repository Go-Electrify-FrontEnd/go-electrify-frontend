"use client";

export { default } from "@/features/reservations/components/reservation-create-button";
import { Dialog, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Plus, Check, ChevronsUpDown } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createReservation } from "@/actions/reservation-actions";
import { toast } from "sonner";
import {
  reservationFormSchema,
  type ReservationFormData,
} from "@/lib/zod/reservation/reservation.request";
import type { Station } from "@/lib/zod/station/station.types";
import type { CarModel } from "@/lib/zod/vehicle-model/vehicle-model.types";
import type { ConnectorType } from "@/lib/zod/connector-type/connector-type.types";
import { cn } from "@/lib/utils";

const initialState = {
  success: false,
  msg: "",
};

interface CreateReservationButtonProps {
  stations: Station[];
  vehicleModels: CarModel[];
  connectorTypes: ConnectorType[];
}

