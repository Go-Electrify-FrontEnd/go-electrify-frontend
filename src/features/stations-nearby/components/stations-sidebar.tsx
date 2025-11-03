"use client";

import { useEffect, useRef } from "react";
import { useStationsNearby } from "@/contexts/stations-nearby-context";
import type { Station } from "@/features/stations/schemas/station.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import Link from "next/link";
import { calculateDistance } from "@/lib/utils";
import NearbyStationSearch from "@/features/stations-nearby/components/search-input";

interface StationsSidebarProps {
  className?: string;
}

export function StationsSidebar({ className = "" }: StationsSidebarProps) {
  const { sortedStations, selectedStation, setSelectedStation, userLocation } =
    useStationsNearby();

  const stationRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Scroll to the selected station when it changes
  useEffect(() => {
    if (
      selectedStation &&
      stationRefs.current &&
      stationRefs.current[selectedStation.id]
    ) {
      const element = stationRefs.current[selectedStation.id];
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [selectedStation]);

  const generateURL = (coordinates: [number, number]) => {
    const [lat, lng] = coordinates;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${lat},${lng}`,
    )}`;
  };

  const getDistance = (station: Station): string => {
    if (!userLocation) return "N/A";

    const distanceKm = calculateDistance(userLocation, [
      station.longitude,
      station.latitude,
    ]);

    return distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${distanceKm.toFixed(1)} km`;
  };

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div className="border-border bg-background p-4">
        <h2 className="text-foreground mb-3 text-xl font-bold">Tìm trạm sạc</h2>

        {/* Search Box */}
        <div className="mb-4">
          <NearbyStationSearch />
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {sortedStations.map((station) => {
          const isSelected = station.id === selectedStation?.id;
          const isActive = station.status === "ACTIVE";

          return (
            <div
              key={station.id}
              ref={(el) => {
                stationRefs.current[station.id] = el;
              }}
              onClick={() => setSelectedStation(station)}
              className={`${
                isSelected
                  ? "bg-accent border-primary"
                  : "bg-background border-border"
              } mb-4 cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-md`}
            >
              {/* Station Name */}
              <h4 className="text-foreground mb-2 text-base leading-tight font-semibold">
                {station.name}
              </h4>

              {/* Status Badge */}
              <div className="mb-3">
                <Badge
                  variant={isActive ? "default" : "destructive"}
                  className="text-xs"
                >
                  <span
                    className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {isActive ? "Đang hoạt động" : "Không hoạt động"}
                </Badge>
              </div>

              {/* Address */}
              <div className="text-muted-foreground mb-3 flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-2">{station.address}</span>
              </div>

              {/* Footer: Distance and Directions */}
              <div className="flex items-center justify-between gap-3 border-t pt-3">
                <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="font-bold">Khoảng cách:</span>{" "}
                  {getDistance(station)}
                </div>

                <Link
                  prefetch={false}
                  href={generateURL([station.latitude, station.longitude])}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80 flex items-center gap-1.5 text-xs font-medium uppercase"
                  >
                    <Navigation className="h-4 w-4" />
                    Chỉ đường
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
