"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Button } from "@/components/ui/button";
import { Navigation, RotateCcw } from "lucide-react";

// Mock data cho các trạm sạc
const chargingStations = [
  {
    id: 1,
    name: "Trạm sạc FPT University",
    coordinates: [106.6297, 10.8431] as [number, number],
    type: "fast",
    available: true,
  },
  {
    id: 2,
    name: "Trạm sạc Vincom Center",
    coordinates: [106.7008, 10.7718] as [number, number],
    type: "normal",
    available: true,
  },
  {
    id: 3,
    name: "Trạm sạc Diamond Plaza",
    coordinates: [106.7003, 10.7831] as [number, number],
    type: "fast",
    available: false,
  },
  {
    id: 4,
    name: "Trạm sạc Landmark 81",
    coordinates: [106.7214, 10.7947] as [number, number],
    type: "super_fast",
    available: true,
  },
  {
    id: 5,
    name: "Trạm sạc Bitexco",
    coordinates: [106.7034, 10.7718] as [number, number],
    type: "normal",
    available: true,
  },
];

// Hàm tính khoảng cách giữa 2 điểm (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Khoảng cách tính bằng km
}

// Hàm tìm các trạm gần nhất
function findNearestStations(
  userLat: number,
  userLon: number,
  stations: typeof chargingStations,
  limit: number = 3
) {
  return stations
    .map((station) => ({
      ...station,
      distance: calculateDistance(
        userLat,
        userLon,
        station.coordinates[1],
        station.coordinates[0]
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

export function StationMap({
  onStationsUpdate,
}: {
  onStationsUpdate?: (stations: any[], location: [number, number]) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const stationMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  const getCurrentLocation = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const location: [number, number] = [longitude, latitude];
          setUserLocation(location);
          updateMapAndStations(longitude, latitude);
          setIsLocating(false);
        },
        (error) => {
          console.warn("Error getting user location:", error.message);
          // If user denies location access, show default stations without loading
          showDefaultStations();
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      // Geolocation not supported, show default stations
      showDefaultStations();
      setIsLocating(false);
    }
  };

  const showDefaultStations = () => {
    // When no location access, just show all stations without distance calculation
    const stationsWithoutDistance = chargingStations.map((station) => ({
      ...station,
      distance: 0, // No distance when location is not available
    }));

    // Pass data to parent component with default location for Vietnam
    const defaultLocation: [number, number] = [106.6297, 10.8231];
    if (onStationsUpdate) {
      onStationsUpdate(stationsWithoutDistance, defaultLocation);
    }

    // Clear existing station markers
    stationMarkersRef.current.forEach((marker) => marker.remove());
    stationMarkersRef.current = [];

    // Add station markers without distance info
    stationsWithoutDistance.forEach((station) => {
      const markerColor = station.available ? "#10B981" : "#EF4444";

      const marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat(station.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm mb-2">${station.name}</h3>
              <p class="text-xs mb-1">⚡ Loại: ${station.type}</p>
              <p class="text-xs mb-1" style="color: ${
                station.available ? "#10B981" : "#EF4444"
              }">
                ${station.available ? "✅ Khả dụng" : "❌ Không khả dụng"}
              </p>
            </div>
          `)
        )
        .addTo(mapRef.current!);

      stationMarkersRef.current.push(marker);
    });
  };

  const updateMapAndStations = (longitude: number, latitude: number) => {
    if (!mapRef.current) return;

    // Update map center with smooth animation
    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom: 15,
      duration: 2000,
    });

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Add new user marker
    userMarkerRef.current = new mapboxgl.Marker({
      color: "#3B82F6",
      scale: 1.2,
    })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<div class="p-2 text-center"><strong>📍 Vị trí của bạn</strong></div>'
        )
      )
      .addTo(mapRef.current);

    // Find and update nearest stations
    const nearestStations = findNearestStations(
      latitude,
      longitude,
      chargingStations,
      5
    );

    // Pass data to parent component
    if (onStationsUpdate) {
      onStationsUpdate(nearestStations, [longitude, latitude]);
    }

    // Clear existing station markers
    stationMarkersRef.current.forEach((marker) => marker.remove());
    stationMarkersRef.current = [];

    // Add station markers
    nearestStations.forEach((station, index) => {
      const markerColor = station.available
        ? index < 3
          ? "#10B981"
          : "#6B7280"
        : "#EF4444";

      const marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat(station.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm mb-2">${station.name}</h3>
              <p class="text-xs mb-1">📍 Khoảng cách: ${station.distance.toFixed(
                2
              )} km</p>
              <p class="text-xs mb-1">⚡ Loại: ${station.type}</p>
              <p class="text-xs mb-1" style="color: ${
                station.available ? "#10B981" : "#EF4444"
              }">
                ${station.available ? "✅ Khả dụng" : "❌ Không khả dụng"}
              </p>
              ${
                index < 3
                  ? '<div class="text-xs mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-center font-medium">⭐ Gần nhất</div>'
                  : ""
              }
            </div>
          `)
        )
        .addTo(mapRef.current!);

      stationMarkersRef.current.push(marker);
    });
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_BOXMAP_API || "";

    if (mapContainerRef.current && !mapRef.current) {
      // Initialize map with default location
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [106.6297, 10.8231],
        zoom: 12,
        maxTileCacheSize: 500,
        minTileCacheSize: 100,
        attributionControl: false, // Better for mobile
      });

      // Ask for location permission on load
      getCurrentLocation();
    }

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
      stationMarkersRef.current.forEach((marker) => marker.remove());
      stationMarkersRef.current = [];

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div className="w-full h-full" ref={mapContainerRef} />

      {/* Location Control Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="bg-white hover:bg-gray-100 text-gray-800 border shadow-lg"
          variant="outline"
        >
          {isLocating ? (
            <RotateCcw className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>

        {userLocation && (
          <Button
            size="sm"
            onClick={() =>
              userLocation &&
              updateMapAndStations(userLocation[0], userLocation[1])
            }
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
            title="Về vị trí hiện tại"
          >
            📍
          </Button>
        )}
      </div>

      {/* Loading Indicator */}
      {isLocating && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 animate-spin text-black" />
              <span className="text-sm font-medium text-black">
                Đang xác định vị trí...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
