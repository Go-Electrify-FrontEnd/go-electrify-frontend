"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Edit2Icon } from "lucide-react";
import { CarModel } from "@/types/car";

interface UpdateCarModelProps {
  carModel: CarModel;
}

export default function UpdateCarModel({
  carModel: {
    id,
    modelName,
    maxPowerKw,
    batteryCapacityKwh,
    createdAt,
    updatedAt,
  },
}: UpdateCarModelProps) {
  // Individual state variables instead of object state
  const [carModelName, setCarModelName] = useState(modelName);
  const [carMaxPowerKw, setCarMaxPowerKw] = useState(maxPowerKw.toString());
  const [carBatteryCapacityKwh, setCarBatteryCapacityKwh] = useState(
    batteryCapacityKwh.toString(),
  );

  const handleSubmit = () => {
    // TODO: Implement update logic
    const updatedData = {
      id,
      modelName: carModelName,
      maxPowerKw: parseInt(carMaxPowerKw),
      batteryCapacityKwh: parseFloat(carBatteryCapacityKwh),
      createdAt,
      updatedAt: new Date().toISOString(), // Update timestamp
    };
    console.log("Updated car model:", updatedData);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit2Icon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Update Car Model</SheetTitle>
          <SheetDescription>
            Update the car model information. Fields marked as read-only cannot
            be modified.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <Label htmlFor="modelName" className="text-sm font-medium">
              Model Name
            </Label>
            <Input
              id="modelName"
              value={carModelName}
              onChange={(e) => setCarModelName(e.target.value)}
              placeholder="Enter car model name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPowerKw" className="text-sm font-medium">
              Max Power (kW)
            </Label>
            <Input
              id="maxPowerKw"
              type="number"
              value={carMaxPowerKw}
              onChange={(e) => setCarMaxPowerKw(e.target.value)}
              placeholder="Enter maximum power in kW"
              className="w-full"
              min="0"
              step="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batteryCapacityKwh" className="text-sm font-medium">
              Battery Capacity (kWh)
            </Label>
            <Input
              id="batteryCapacityKwh"
              type="number"
              value={carBatteryCapacityKwh}
              onChange={(e) => setCarBatteryCapacityKwh(e.target.value)}
              placeholder="Enter battery capacity in kWh"
              className="w-full"
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="createdAt"
              className="text-muted-foreground text-sm font-medium"
            >
              Created At (Read-only)
            </Label>
            <Input
              id="createdAt"
              value={new Date(createdAt).toLocaleString()}
              readOnly
              className="bg-muted w-full cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="updatedAt"
              className="text-muted-foreground text-sm font-medium"
            >
              Updated At (Read-only)
            </Label>
            <Input
              id="updatedAt"
              value={new Date(updatedAt).toLocaleString()}
              readOnly
              className="bg-muted w-full cursor-not-allowed"
            />
          </div>

          <div className="flex gap-3 pt-6">
            <Button onClick={handleSubmit} className="flex-1">
              Update Car Model
            </Button>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
