"use server";

import * as reservations from "@/features/reservations/services/reservations";

export async function createReservation(prev: unknown, formData: FormData) {
  return await reservations.createReservation(prev, formData);
}
