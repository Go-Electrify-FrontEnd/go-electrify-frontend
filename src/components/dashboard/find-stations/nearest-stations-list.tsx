"use client";

import { StationWithDistance } from "@/app/dashboard/find-stations/page";
import { StationCard } from "./station-card";

interface NearestStationsListProps {
  stations: StationWithDistance[];
  location: { lat: number; lng: number } | null;
}

export const NearestStationsList = ({ stations }: NearestStationsListProps) => {
  return (
    <div className="bg-card border-border/50 no-scrollbar h-[60vh] overflow-hidden rounded-xl border lg:h-[65vh]">
      <div className="border-border/50 border-b p-4">
        <h3 className="text-sm font-medium">Danh sách trạm</h3>
        <p className="text-muted-foreground mt-1 text-xs">
          {stations.length} kết quả
        </p>
      </div>
      <div className="no-scrollbar h-full space-y-3 overflow-y-auto p-4">
        {stations.map((station, index) => (
          <StationCard key={station.id} station={station} index={index} />
        ))}
      </div>
    </div>
  );
};
