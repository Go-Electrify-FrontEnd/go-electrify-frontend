"use client";

import { StationCard } from "./station-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStationsNearby } from "@/contexts/stations-nearby-context";

export const NearestStationsList = () => {
  const { sortedStations } = useStationsNearby();

  return (
    <Card className="h-[60vh] overflow-hidden lg:h-[65vh]">
      <CardHeader className="border-b">
        <CardTitle className="text-sm font-medium">Danh sách trạm</CardTitle>
        <CardDescription>{sortedStations.length} kết quả</CardDescription>
      </CardHeader>
      <CardContent className="no-scrollbar h-full space-y-4 overflow-y-auto">
        {sortedStations.map((station, index) => (
          <StationCard key={station.id} station={station} index={index} />
        ))}
      </CardContent>
    </Card>
  );
};
