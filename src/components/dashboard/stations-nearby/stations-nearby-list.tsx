"use client";

import { Station } from "@/types/station";
import { StationCard } from "./station-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NearestStationsListProps {
  stations: Station[];
  location: { lat: number; lng: number } | null;
}

export const NearestStationsList = ({ stations }: NearestStationsListProps) => {
  return (
    <Card className="h-[60vh] overflow-hidden lg:h-[65vh]">
      <CardHeader className="border-b">
        <CardTitle className="text-sm font-medium">Danh sách trạm</CardTitle>
        <CardDescription>{stations.length} kết quả</CardDescription>
      </CardHeader>
      <CardContent className="no-scrollbar h-full space-y-4 overflow-y-auto">
        {stations.map((station, index) => (
          <StationCard key={station.id} station={station} index={index} />
        ))}
      </CardContent>
    </Card>
  );
};
