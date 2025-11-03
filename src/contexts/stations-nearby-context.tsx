"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Station } from "@/features/stations/schemas/station.types";
import { calculateDistance } from "@/lib/utils";

type Coordinates = [number, number];

export type SearchMode = "ALL" | "NAME" | "ADDRESS";

interface StationsNearbyContextValue {
  userLocation: Coordinates | null;
  stations: Station[];
  sortedStations: Station[];
  searchQuery: string;
  searchMode: SearchMode;

  setSearchQuery: (query: string) => void;
  setSearchMode: (mode: SearchMode) => void;
  updateUserLocation: (coords: Coordinates) => void;
  resetStations: () => void;
}

const StationsNearbyContext = createContext<
  StationsNearbyContextValue | undefined
>(undefined);

interface StationsNearbyProviderProps {
  stations: Station[];
  children: React.ReactNode;
}

export function StationsNearbyProvider({
  stations,
  children,
}: StationsNearbyProviderProps) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [sortedStations, setSortedStations] = useState<Station[]>([]);

  const [searchQuery, setSearchQueryState] = useState<string>("");
  const [searchMode, setSearchModeState] = useState<SearchMode>("ALL");

  const displayStations = (() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return stations;
    }

    if (searchMode === "ALL") {
      return stations.filter((station) => {
        return (
          station.name.toLowerCase().includes(q) ||
          station.address.toLowerCase().includes(q)
        );
      });
    }

    if (searchMode === "NAME") {
      return stations.filter((station) =>
        station.name.toLowerCase().includes(q),
      );
    }

    return stations.filter((station) =>
      station.address.toLowerCase().includes(q),
    );
  })();

  useEffect(() => {
    let isCancelled = false;

    const sortStations = async () => {
      if (!userLocation) {
        setSortedStations(displayStations);
        return;
      }

      const stationsWithDistances = await Promise.all(
        displayStations.map(async (station) => {
          const distance = await calculateDistance(userLocation, [
            station.longitude,
            station.latitude,
          ]);
          return { station, distance };
        }),
      );

      if (isCancelled) return;

      const sorted = stationsWithDistances
        .sort((a, b) => a.distance - b.distance)
        .map(({ station }) => station);

      setSortedStations(sorted);
    };

    sortStations();

    return () => {
      isCancelled = true;
    };
  }, [displayStations, userLocation]);

  const updateUserLocation = useCallback((coords: Coordinates) => {
    setUserLocation(coords);
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    setSearchQueryState(q);
  }, []);

  const setSearchMode = useCallback((m: SearchMode) => {
    setSearchModeState(m);
  }, []);

  const resetStations = useCallback(() => {
    setSearchQueryState("");
  }, []);

  const contextValue = {
    userLocation,
    stations: displayStations,
    sortedStations,
    searchQuery,
    searchMode,
    setSearchQuery,
    setSearchMode,
    resetStations,
    updateUserLocation,
  };

  return (
    <StationsNearbyContext.Provider value={contextValue}>
      {children}
    </StationsNearbyContext.Provider>
  );
}

export function useStationsNearby() {
  const context = useContext(StationsNearbyContext);

  if (!context) {
    throw new Error(
      "useStationsNearby must be used within StationsNearbyProvider",
    );
  }

  return context;
}
