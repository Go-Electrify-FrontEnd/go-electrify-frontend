"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "es-toolkit";
import { z } from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Loader2, MapPin, Search, X } from "lucide-react";

interface SearchResult {
  address: string;
  latitude: number;
  longitude: number;
  placeType?: string;
  region?: string;
}

// Zod schema for Mapbox Search Box API v1 response
const mapboxFeatureSchema = z.object({
  type: z.string(),
  geometry: z
    .object({
      coordinates: z.array(z.number()).length(2),
      type: z.string(),
    })
    .optional(),
  properties: z
    .object({
      name: z.string().optional(),
      full_address: z.string().optional(),
      place_formatted: z.string().optional(),
      address: z.string().optional(),
      feature_type: z.string().optional(),
      maki: z.string().optional(),
      context: z
        .object({
          country: z
            .object({
              name: z.string().optional(),
              country_code: z.string().optional(),
            })
            .optional(),
          region: z
            .object({
              name: z.string().optional(),
            })
            .optional(),
          place: z
            .object({
              name: z.string().optional(),
            })
            .optional(),
          neighborhood: z
            .object({
              name: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      coordinates: z
        .object({
          latitude: z.number(),
          longitude: z.number(),
        })
        .optional(),
    })
    .optional(),
});

const mapboxResponseSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(mapboxFeatureSchema),
  attribution: z.string().optional(),
});

type MapboxFeature = z.infer<typeof mapboxFeatureSchema>;

interface AddressSearchProps {
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
  /**
   * Optional Mapbox public access token. Falls back to NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.
   */
  accessToken?: string;
  /**
   * Minimum characters to trigger a search.
   */
  minQueryLength?: number;
  /**
   * Debounce delay (ms).
   */
  debounceMs?: number;
  /**
   * Maximum number of results to request from Mapbox.
   */
  limit?: number;
  /**
   * ISO 3166 alpha 2 country codes to limit results to.
   */
  country?: string;
  /**
   * ISO language code for the response. Defaults to English if not provided.
   */
  language?: string;
}

export default function AddressSearch({
  onSelect,
  placeholder = "Tìm kiếm địa điểm...",
  className = "",
  minQueryLength = 3,
  debounceMs = 350,
  limit = 10,
  country = "VN",
  language = "vi",
}: AddressSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const cacheRef = useRef<Record<string, SearchResult[]>>({});
  const abortRef = useRef<AbortController | null>(null);
  const debouncedFetchRef = useRef<ReturnType<typeof debounce> | null>(null);

  const token = process.env.NEXT_PUBLIC_BOXMAP_API;

  const resetSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false);
  }, []);

  const transformFeatureToResult = useCallback(
    (f: MapboxFeature): SearchResult => {
      const longitude =
        f.geometry?.coordinates[0] ?? f.properties?.coordinates?.longitude ?? 0;
      const latitude =
        f.geometry?.coordinates[1] ?? f.properties?.coordinates?.latitude ?? 0;
      const address =
        f.properties?.full_address ||
        f.properties?.name ||
        f.properties?.place_formatted ||
        "";
      const placeType = f.properties?.feature_type;
      const region =
        f.properties?.context?.place?.name ||
        f.properties?.context?.neighborhood?.name ||
        f.properties?.context?.region?.name ||
        f.properties?.context?.country?.name;

      return { address, latitude, longitude, placeType, region };
    },
    [],
  );

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query || query.length < minQueryLength) {
        resetSuggestions();
        return;
      }

      const cacheKey = query.trim().toLowerCase();
      const cached = cacheRef.current[cacheKey];

      if (cached) {
        setSuggestions(cached);
        setShowSuggestions(true);
        setIsSearching(false);
        return;
      }

      if (!token) {
        console.warn(
          "Mapbox access token is not configured. Set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN or pass accessToken prop.",
        );
        resetSuggestions();
        setShowSuggestions(true);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = new URL(
          "https://api.mapbox.com/search/searchbox/v1/forward",
        );
        url.searchParams.set("q", query);
        url.searchParams.set("access_token", token);
        url.searchParams.set("limit", String(limit));
        url.searchParams.set("country", country);
        url.searchParams.set("language", language);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          console.error("Mapbox search failed:", response.status);
          resetSuggestions();
          setShowSuggestions(true);
          return;
        }

        const json = await response.json();
        const parseResult = mapboxResponseSchema.safeParse(json);

        if (!parseResult.success) {
          console.error("Invalid Mapbox response format:", parseResult.error);
          resetSuggestions();
          setShowSuggestions(true);
          return;
        }

        const results = parseResult.data.features.map(transformFeatureToResult);

        cacheRef.current[cacheKey] = results;
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === "AbortError") return;

        console.error("Mapbox search error:", err);
        resetSuggestions();
        setShowSuggestions(true);
      } finally {
        setIsSearching(false);
      }
    },
    [
      token,
      minQueryLength,
      limit,
      country,
      language,
      resetSuggestions,
      transformFeatureToResult,
    ],
  );

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      abortRef.current?.abort();
      debouncedFetchRef.current?.cancel();

      setSearchQuery(result.address);
      setShowSuggestions(false);
      setSuggestions([]);
      onSelect?.(result);
    },
    [onSelect],
  );

  const handleEnterKey = useCallback(() => {
    if (suggestions.length > 0) {
      handleSelectResult(suggestions[0]);
    }
  }, [suggestions, handleSelectResult]);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    resetSuggestions();
    debouncedFetchRef.current?.cancel();
  }, [resetSuggestions]);

  const handleInputChange = useCallback(
    (value: string) => {
      setSearchQuery(value);

      if (value.length < minQueryLength) {
        resetSuggestions();
        debouncedFetchRef.current?.cancel();
        return;
      }

      setIsSearching(true);
      debouncedFetchRef.current?.(value);
    },
    [minQueryLength, resetSuggestions],
  );

  useEffect(() => {
    const debounced = debounce(fetchSuggestions, debounceMs);
    debouncedFetchRef.current = debounced;

    return () => {
      abortRef.current?.abort();
      debounced.cancel();
      debouncedFetchRef.current = null;
    };
  }, [debounceMs, fetchSuggestions]);

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative">
        <InputGroup>
          <InputGroupAddon>
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Search</span>
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleEnterKey();
              }
            }}
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
          />
          {(isSearching || searchQuery) && (
            <InputGroupAddon align="inline-end" className="gap-1.5">
              {isSearching && (
                <Loader2
                  className="text-muted-foreground h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {searchQuery && (
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </InputGroupButton>
              )}
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="bg-popover absolute top-full z-50 mt-2 w-full rounded-lg border shadow-lg">
            <div className="max-h-[300px] overflow-y-auto p-2">
              {suggestions.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="hover:bg-accent hover:text-accent-foreground flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors"
                >
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{result.address}</p>
                    {result.region && (
                      <p className="text-muted-foreground text-xs">
                        {result.region}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selection is reported via onSelect; parent controls display of a picked location. */}

      {/* No Results Message */}
      {showSuggestions && suggestions.length === 0 && !isSearching && (
        <div className="bg-muted/50 mt-2 rounded-lg border p-4 text-center">
          <p className="text-muted-foreground text-sm">
            Không tìm thấy kết quả cho &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
