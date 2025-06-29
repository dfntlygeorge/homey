"use client";

import { cn, formatEnumValue } from "@/lib/utils";
import { SearchInput } from "../shared/search-input";
import { RangeFilters } from "./range-filters";
import { SidebarProps } from "@/config/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { parseAsString, useQueryStates } from "nuqs";
import { routes } from "@/config/routes";
import {
  CaretakerAvailability,
  CurfewPolicy,
  GenderPolicy,
  KitchenAvailability,
  LaundryAvailability,
  PetPolicy,
  RoomType,
  UtilityInclusion,
  WifiAvailability,
} from "@prisma/client";
import { NativeSelect } from "../ui/native-select";
import { ProximityFilter } from "./proximity-filter";
import { ArrowUpDown, Filter, X } from "lucide-react";
import { EXCLUDED_KEYS, SORT_OPTIONS } from "@/config/constants";

export const Sidebar = ({ minMaxValues, searchParams }: SidebarProps) => {
  const router = useRouter();
  const [filterCount, setFilterCount] = useState(0);
  const { _min, _max } = minMaxValues;
  const [queryStates, setQueryStates] = useQueryStates(
    {
      minRent: parseAsString.withDefault(""),
      maxRent: parseAsString.withDefault(""),
      roomType: parseAsString.withDefault(""),
      genderPolicy: parseAsString.withDefault(""),
      curfew: parseAsString.withDefault(""),
      laundry: parseAsString.withDefault(""),
      caretaker: parseAsString.withDefault(""),
      kitchen: parseAsString.withDefault(""),
      wifi: parseAsString.withDefault(""),
      pets: parseAsString.withDefault(""),
      utilities: parseAsString.withDefault(""),
      latitude: parseAsString.withDefault(""),
      longitude: parseAsString.withDefault(""),
      radius: parseAsString.withDefault(""),
      address: parseAsString.withDefault(""),
      sortBy: parseAsString.withDefault(""),
    },
    {
      shallow: false,
    }
  );

  useEffect(() => {
    const filterCount = Object.entries(
      searchParams as Record<string, string>
    ).filter(([key, value]) => !EXCLUDED_KEYS.includes(key) && value).length;
    setFilterCount(filterCount);
  }, [searchParams]);

  const clearFilters = () => {
    const url = new URL(routes.listings, process.env.NEXT_PUBLIC_APP_URL);
    window.location.replace(url.toString());
    setFilterCount(0);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setQueryStates({ [name]: value || null });
    router.refresh();
  };

  const handleLocationChange = (params: {
    latitude?: string;
    longitude?: string;
    radius?: string;
    address?: string;
  }) => {
    setQueryStates({
      latitude: params.latitude || null,
      longitude: params.longitude || null,
      radius: params.radius || null,
      address: params.address || null,
    });
    router.refresh();
  };

  return (
    <div className="hidden w-[22rem] border-r border-border bg-card lg:flex lg:flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
            {filterCount > 0 && (
              <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 text-xs font-medium">
                {filterCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className={cn(
              "flex items-center gap-1 text-sm font-medium transition-colors",
              !filterCount
                ? "text-muted-foreground cursor-not-allowed opacity-50"
                : "text-destructive hover:text-destructive/80 cursor-pointer"
            )}
            aria-disabled={!filterCount}
            disabled={!filterCount}
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Section */}
        <div className="p-6 border-b border-border">
          <SearchInput
            placeholder="Search properties..."
            className="w-full rounded-lg border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div className="p-6 border-b border-border">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-primary" />
              Sort By
            </h3>
            <NativeSelect
              name="sortBy"
              value={queryStates.sortBy || ""}
              onChange={handleChange}
              options={SORT_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              placeholder="Choose sorting..."
              className="w-full"
              selectClassName="text-sm"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="p-6 space-y-6">
          {/* Location Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              Location & Proximity
            </h3>
            <div className="pl-3">
              <ProximityFilter
                searchParams={searchParams}
                onLocationChange={handleLocationChange}
              />
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              Price Range
            </h3>
            <div className="pl-3">
              <RangeFilters
                label=""
                minName="minRent"
                maxName="maxRent"
                defaultMin={_min.rent || 0}
                defaultMax={_max.rent || 21474836}
                handleChange={handleChange}
                searchParams={searchParams}
                increment={1000}
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              Property Details
            </h3>
            <div className="pl-3 space-y-4">
              <NativeSelect
                label="Room Type"
                name="roomType"
                value={queryStates.roomType || ""}
                onChange={handleChange}
                options={Object.values(RoomType).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="Gender Policy"
                name="genderPolicy"
                value={queryStates.genderPolicy || ""}
                onChange={handleChange}
                options={Object.values(GenderPolicy).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />
            </div>
          </div>

          {/* Rules & Policies */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              Rules & Policies
            </h3>
            <div className="pl-3 space-y-4">
              <NativeSelect
                label="Curfew Policy"
                name="curfew"
                value={queryStates.curfew || ""}
                onChange={handleChange}
                options={Object.values(CurfewPolicy).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="Pet Policy"
                name="pets"
                value={queryStates.pets || ""}
                onChange={handleChange}
                options={Object.values(PetPolicy).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              Amenities & Services
            </h3>
            <div className="pl-3 space-y-4">
              <NativeSelect
                label="Kitchen Availability"
                name="kitchen"
                value={queryStates.kitchen || ""}
                onChange={handleChange}
                options={Object.values(KitchenAvailability).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="Laundry Facilities"
                name="laundry"
                value={queryStates.laundry || ""}
                onChange={handleChange}
                options={Object.values(LaundryAvailability).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="WiFi Access"
                name="wifi"
                value={queryStates.wifi || ""}
                onChange={handleChange}
                options={Object.values(WifiAvailability).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="Caretaker Service"
                name="caretaker"
                value={queryStates.caretaker || ""}
                onChange={handleChange}
                options={Object.values(CaretakerAvailability).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="Utilities Included"
                name="utilities"
                value={queryStates.utilities || ""}
                onChange={handleChange}
                options={Object.values(UtilityInclusion).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
