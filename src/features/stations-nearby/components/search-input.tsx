"use client";

import { useEffect, useMemo, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, Search } from "lucide-react";
import {
  useStationsNearby,
  type SearchMode,
} from "@/contexts/stations-nearby-context";

const MODE_LABEL: Record<SearchMode, string> = {
  ALL: "Tất cả",
  NAME: "Tên",
  ADDRESS: "Địa chỉ",
};

export default function NearbyStationSearch() {
  const {
    setSearchQuery,
    searchQuery,
    sortedStations,
    searchMode,
    setSearchMode,
  } = useStationsNearby();
  const [value, setValue] = useState<string>(searchQuery || "");

  // Keep local input in sync when the query is changed externally.
  useEffect(() => {
    setValue(searchQuery || "");
  }, [searchQuery]);

  // Debounce calls to the provider to avoid filtering on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchQuery(value.trim());
    }, 250);
    return () => clearTimeout(id);
  }, [value, setSearchQuery]);

  const label = useMemo(() => MODE_LABEL[searchMode], [searchMode]);

  return (
    <InputGroup>
      <InputGroupInput
        placeholder="Tìm kiếm trạm..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <InputGroupAddon align="inline-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton variant="ghost" className="!pr-1.5 text-xs">
              {label} <ChevronDownIcon className="size-3" />
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="[--radius:0.95rem]">
            <DropdownMenuRadioGroup
              value={searchMode}
              onValueChange={(val) => setSearchMode(val as SearchMode)}
            >
              <DropdownMenuRadioItem value="ALL">Tất cả</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="NAME">Tên</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ADDRESS">
                Địa chỉ
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  );
}
