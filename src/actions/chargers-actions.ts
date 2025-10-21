"use server";

import * as chargers from "@/features/stations/services/chargers-actions";

export async function createCharger(prevState: unknown, formData: FormData) {
  return await chargers.createCharger(prevState, formData);
}

export async function updateCharger(prevState: unknown, formData: FormData) {
  return await chargers.updateCharger(prevState, formData);
}
