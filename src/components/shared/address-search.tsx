"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, X } from "lucide-react";

interface SearchResult {
  address: string;
  latitude: number;
  longitude: number;
  placeType?: string;
  region?: string;
}

interface AddressSearchProps {
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressSearch({
  onSelect,
  placeholder = "Tìm kiếm địa điểm...",
  className = "",
}: AddressSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    // This is where you'll integrate with your geocoding service
    // For now, it's just UI with state management
    setIsSearching(true);

    // Simulate API call - replace with actual implementation
    setTimeout(() => {
      // Example mock results
      const mockResults: SearchResult[] = [
        {
          address: "123 Đường Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh",
          latitude: 10.7769,
          longitude: 106.7009,
          placeType: "address",
          region: "Ho Chi Minh City",
        },
        {
          address: "456 Đường Lê Lợi, Quận 1, Thành phố Hồ Chí Minh",
          latitude: 10.7744,
          longitude: 106.6978,
          placeType: "address",
          region: "Ho Chi Minh City",
        },
      ];

      setSuggestions(mockResults);
      setShowSuggestions(true);
      setIsSearching(false);
    }, 500);
  };

  const handleSelectResult = (result: SearchResult) => {
    setSearchResult(result);
    setSearchQuery(result.address);
    setShowSuggestions(false);
    onSelect?.(result);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResult(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 2) {
      handleSearch();
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              className="pr-9 pl-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={!searchQuery || isSearching}
          >
            {isSearching ? "Đang tìm..." : "Tìm kiếm"}
          </Button>
        </div>

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

      {/* Selected Result Display */}
      {searchResult && (
        <div className="bg-muted/50 mt-3 space-y-3 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <MapPin className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-sm font-medium">Địa điểm đã chọn:</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {searchResult.address}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Vĩ độ:
                  </span>
                  <p className="font-mono font-medium">
                    {searchResult.latitude.toFixed(6)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Kinh độ:
                  </span>
                  <p className="font-mono font-medium">
                    {searchResult.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Xóa vị trí</span>
            </Button>
          </div>
        </div>
      )}

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
