import { useState, useCallback } from "react";

// Hook generate by AI to get user's current location with error handling and loading state

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface UseLocationReturn {
  location: [number, number] | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<[number, number] | null>;
}

const DEFAULT_OPTIONS: Required<UseLocationOptions> = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
};

export function useLocation(
  options: UseLocationOptions = {}
): UseLocationReturn {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = { ...DEFAULT_OPTIONS, ...options };

  // Get current location without caching
  const getCurrentLocation = useCallback(async (): Promise<
    [number, number] | null
  > => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const errorMsg = "Trình duyệt không hỗ trợ định vị GPS";
      setError(errorMsg);
      setLocation(null);
      return null;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const coordinates: [number, number] = [longitude, latitude];

          setLocation(coordinates);
          setIsLoading(false);
          setError(null);

          console.log("📍 Lấy vị trí thành công:", coordinates);
          resolve(coordinates);
        },
        (error) => {
          let errorMessage = "Không thể lấy vị trí hiện tại";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Người dùng từ chối chia sẻ vị trí";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Thông tin vị trí không khả dụng";
              break;
            case error.TIMEOUT:
              errorMessage = "Yêu cầu vị trí đã hết thời gian chờ";
              break;
          }

          console.warn("❌ Lỗi lấy vị trí:", errorMessage);
          setError(errorMessage);
          setIsLoading(false);
          setLocation(null);
          resolve(null);
        },
        {
          enableHighAccuracy: config.enableHighAccuracy,
          timeout: config.timeout,
          maximumAge: config.maximumAge,
        }
      );
    });
  }, [config]);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
  };
}
