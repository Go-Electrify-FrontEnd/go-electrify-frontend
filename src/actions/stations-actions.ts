"use server";

import * as stations from "@/features/stations/services/stations";

export async function createStation(prev: unknown, formData: FormData) {
  return await stations.createStation(prev, formData);
}

export async function updateStation(prev: unknown, formData: FormData) {
  return await stations.updateStation(prev, formData);
}

export async function deleteStation(prev: unknown, formData: FormData) {
  return await stations.deleteStation(prev, formData);
}
