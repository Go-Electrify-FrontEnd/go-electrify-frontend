"use server";

import { CarModel } from "@/types/reservation";

const mockCarModels: CarModel[] = [
  {
    id: 1,
    brand: "Tesla",
    model: "Model 3",
    year: "2024",
    batteryCapacity: 75,
    supportedPorts: ["CCS2", "Type2"],
  },
  {
    id: 2,
    brand: "Tesla",
    model: "Model S",
    year: "2024",
    batteryCapacity: 100,
    supportedPorts: ["CCS2", "Type2"],
  },
  {
    id: 3,
    brand: "BMW",
    model: "iX3",
    year: "2024",
    batteryCapacity: 80,
    supportedPorts: ["CCS2", "Type2"],
  },
  {
    id: 4,
    brand: "Audi",
    model: "e-tron GT",
    year: "2024",
    batteryCapacity: 93,
    supportedPorts: ["CCS2", "CHAdeMO", "Type2"],
  },
  {
    id: 5,
    brand: "Mercedes",
    model: "EQS",
    year: "2024",
    batteryCapacity: 108,
    supportedPorts: ["CCS2", "Type2"],
  },
];

export async function getCarModels(): Promise<CarModel[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real application, you would fetch from your API here:
    // const response = await fetch('/api/car-models');
    // const carModels = await response.json();
    // return carModels;

    return mockCarModels;
  } catch (error) {
    console.error("Error fetching car models:", error);
    throw new Error("Failed to fetch car models");
  }
}
