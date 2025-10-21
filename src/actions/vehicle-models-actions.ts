"use server";

import * as vehicleModels from "@/features/vehicle-models/services/vehicle-models-actions";

export async function createVehicleModel(prev: unknown, formData: FormData) {
  return await vehicleModels.createVehicleModel(prev, formData);
}

export async function updateVehicleModel(prev: unknown, formData: FormData) {
  return await vehicleModels.updateVehicleModel(prev, formData);
}

export async function deleteVehicleModel(prev: unknown, formData: FormData) {
  return await vehicleModels.deleteVehicleModel(prev, formData);
}
