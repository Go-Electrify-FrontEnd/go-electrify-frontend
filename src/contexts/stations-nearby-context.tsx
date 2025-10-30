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

type Coordinates = [number, number];

export type SearchMode = "ALL" | "NAME" | "ADDRESS";

interface StationsNearbyContextValue {
  /** The last known user coordinates (lng, lat). */
  userLocation: Coordinates | null;
  /** Currently visible (filtered) stations managed by the provider. */
  stations: Station[];
  /** Stations sorted by distance from the user's location. */
  sortedStations: Station[];
  /** Current search query used to filter stations by name or address. */
  searchQuery: string;
  /** Current search mode used to determine which fields to match. */
  searchMode: SearchMode;
  /** Update the search query; provider will filter displayed stations. */
  setSearchQuery: (query: string) => void;
  /** Update the active search mode used when filtering. */
  setSearchMode: (mode: SearchMode) => void;
  /** Replace the underlying station list (useful for external refreshes). */
  setStations: (stations: Station[]) => void;
  /** Reset any active search and restore the original station list. */
  resetStations: () => void;
  updateUserLocation: (coords: Coordinates) => void;
}

const StationsNearbyContext = createContext<
  StationsNearbyContextValue | undefined
>(undefined);

interface StationsNearbyProviderProps {
  stations: Station[];
  children: React.ReactNode;
}

const EARTH_RADIUS_KM = 6371;

const toRadians = (value: number) => (value * Math.PI) / 180;

function calculateDistance(origin: Coordinates, station: Station) {
  const [originLng, originLat] = origin;
  const targetLat = station.latitude;
  const targetLng = station.longitude;

  const dLat = toRadians(targetLat - originLat);
  const dLng = toRadians(targetLng - originLng);
  const originLatRad = toRadians(originLat);
  const targetLatRad = toRadians(targetLat);

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(originLatRad) *
      Math.cos(targetLatRad) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const centralAngle =
    2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return EARTH_RADIUS_KM * centralAngle;
}

/**
 * Provides nearby station data sorted dynamically by the user's current location.
 */
export function StationsNearbyProvider({
  stations,
  children,
}: StationsNearbyProviderProps) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const [searchQuery, setSearchQueryState] = useState<string>("");
  const [searchMode, setSearchModeState] = useState<SearchMode>("ALL");

  // Derive filtered stations based on search query and mode using useMemo
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

    // ADDRESS mode
    return stations.filter((station) =>
      station.address.toLowerCase().includes(q),
    );
  }, [stations, searchQuery, searchMode]);

  const sortedStations = useMemo(() => {
    if (!userLocation) {
      return displayStations;
    }

    return [...displayStations].sort((stationA, stationB) => {
      const distanceA = calculateDistance(userLocation, stationA);
      const distanceB = calculateDistance(userLocation, stationB);

      return distanceA - distanceB;
    });
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

  const setStations = useCallback((newStations: Station[]) => {
    // This function is no longer needed as we derive displayStations from stations
    // Keep for API compatibility
  }, []);

  const resetStations = useCallback(() => {
    setSearchQueryState("");
  }, []);

  const contextValue = useMemo(
    () => ({
      userLocation,
      stations: displayStations,
      sortedStations,
      searchQuery,
      searchMode,
      setSearchQuery,
      setSearchMode,
      setStations,
      resetStations,
      updateUserLocation,
    }),
    [
      displayStations,
      sortedStations,
      searchQuery,
      searchMode,
      updateUserLocation,
      userLocation,
      setSearchQuery,
      setSearchMode,
      setStations,
      resetStations,
    ],
  );

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
