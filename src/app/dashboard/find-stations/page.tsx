"use client";

import { useState } from "react";
import { StationMap } from "@/components/dashboard/find-stations/station-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { NearestStationsList } from "@/components/dashboard/find-stations/nearest-stations-list";

export interface StationWithDistance {
  id: number;
  name: string;
  coordinates: [number, number];
  type: string;
  available: boolean;
  distance?: number;
}

export default function FindStationsPage() {
  const [nearestStations, setNearestStations] = useState<StationWithDistance[]>(
    []
  );
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  const handleStationsUpdate = (
    stations: StationWithDistance[],
    location: [number, number]
  ) => {
    setNearestStations(stations);
    setUserLocation(location);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Tìm Điểm Sạc
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Tìm và định vị các trạm sạc xe điện gần bạn
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Navigation className="h-4 w-4" />
          {userLocation
            ? `Vị trí: ${userLocation[1].toFixed(4)}, ${userLocation[0].toFixed(
                4
              )}`
            : "Vị trí: Việt Nam"}
        </div>
      </div>

      {/* Map Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Bản Đồ Trạm Sạc
          </CardTitle>
          <CardDescription>
            Xem vị trí các trạm sạc trên bản đồ và tìm tuyến đường tới đó
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full overflow-hidden rounded-lg">
            <StationMap onStationsUpdate={handleStationsUpdate} />
          </div>
        </CardContent>
      </Card>

      {/* Nearest Stations List */}
      <NearestStationsList
        stations={nearestStations}
        userLocation={userLocation}
      />
    </div>
  );
}
