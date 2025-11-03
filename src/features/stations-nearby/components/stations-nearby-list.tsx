"use client";

import { StationCard } from "./station-card";
import { useStationsNearby } from "@/contexts/stations-nearby-context";

export const NearestStationsList = () => {
  const { sortedStations } = useStationsNearby();

  return (
    <div className="no-scrollbar flex flex-col gap-4 overflow-y-auto">
      {sortedStations.map((station, index) => (
        <StationCard key={station.id} station={station} index={index} />
      ))}
    </div>
  );
};
