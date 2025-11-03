"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  selectedStation: Station | null;

  setSearchQuery: (query: string) => void;
  setSearchMode: (mode: SearchMode) => void;
  updateUserLocation: (coords: Coordinates) => void;
  resetStations: () => void;
  setSelectedStation: (station: Station | null) => void;
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
  const [selectedStation, setSelectedStationState] = useState<Station | null>(null);

  const [searchQuery, setSearchQueryState] = useState<string>("");
  const [searchMode, setSearchModeState] = useState<SearchMode>("ALL");

  // Filter stations based on search query and mode
  const displayStations = useMemo(() => {
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
  }, [stations, searchQuery, searchMode]);

  // Sort stations by distance from user location
  const sortedStations = useMemo(() => {
    if (!userLocation) {
      return displayStations;
    }

    // Calculate distances and sort stations by proximity
    const stationsWithDistances = displayStations.map((station) => {
      const distance = calculateDistance(userLocation, [
        station.longitude,
        station.latitude,
      ]);
      return { station, distance };
    });

    return stationsWithDistances
      .sort((a, b) => a.distance - b.distance)
      .map(({ station }) => station);
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

  const setSelectedStation = useCallback((station: Station | null) => {
    setSelectedStationState(station);
  }, []);

  const contextValue = {
    userLocation,
    stations: displayStations,
    sortedStations,
    searchQuery,
    searchMode,
    selectedStation,
    setSearchQuery,
    setSearchMode,
    resetStations,
    updateUserLocation,
    setSelectedStation,
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
