"use server";
import { getBackendUrl } from "@/lib/utils";
import { CarModel } from "@/types/car";

export async function getCarModels() {
  const res = await fetch(getBackendUrl("api/car-models"));
  const carModels: CarModel[] = await res.json();
  return carModels;
}
