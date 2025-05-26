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
import { Select } from "../ui/select";

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
    },
    {
      shallow: false, // refreshes the data every time the query state changes
    }
  );
  useEffect(() => {
    const filterCount = Object.entries(
      searchParams as Record<string, string>
    ).filter(([key, value]) => key !== "page" && value).length; // ignore page and empty values
    setFilterCount(filterCount);
  }, [searchParams]);

  const clearFilters = () => {
    const url = new URL(routes.listings, process.env.NEXT_PUBLIC_APP_URL); // construct the absolute URL for the listings page
    window.location.replace(url.toString()); // redirects the user to the new URL.
    setFilterCount(0);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setQueryStates({ [name]: value || null }); // Updates URL to ?make=1
    router.refresh(); // Refreshes the page to reflect the new filters.
  };
  return (
    <div className="border-muted hidden w-[21.5rem] border-r py-4 lg:block">
      <div>
        <div className="flex justify-between px-4 text-lg font-semibold">
          <span>Filters</span>
          <button
            type="button"
            onClick={clearFilters}
            className={cn(
              "py-1 text-sm text-gray-500",
              !filterCount
                ? "disabled pointer-events-none opacity-50"
                : "cursor-pointer hover:underline"
            )}
            aria-disabled={!filterCount}
          >
            Clear all {filterCount ? `(${filterCount})` : null}
          </button>
        </div>
        <div className="mt-2" />
      </div>
      <div className="p-4">
        <SearchInput
          placeholder="Search classifieds..."
          className="focus:ring-primary w-full rounded-md border py-2 focus:ring-2 focus:outline-hidden"
        />
      </div>
      <div className="space-y-2 p-4">
        <RangeFilters
          label="Price"
          minName="minRent"
          maxName="maxRent"
          defaultMin={_min.rent || 0}
          defaultMax={_max.rent || 21474836}
          handleChange={handleChange}
          searchParams={searchParams}
          increment={1000}
        />
        <Select
          label="Room Type"
          name="roomType"
          value={queryStates.roomType || ""}
          onChange={handleChange}
          options={Object.values(RoomType).map((value) => ({
            label: formatEnumValue(value), // formatOdoUnit
            value,
          }))}
        />
        <Select
          label="Gender Policy"
          name="genderPolicy"
          value={queryStates.genderPolicy || ""}
          onChange={handleChange}
          options={Object.values(GenderPolicy).map((value) => ({
            label: formatEnumValue(value), // formatOdoUnit
            value,
          }))}
        />
        <Select
          label="Curfew Policy"
          name="curfew"
          value={queryStates.curfew || ""}
          onChange={handleChange}
          options={Object.values(CurfewPolicy).map((value) => ({
            label: formatEnumValue(value), // formatOdoUnit
            value,
          }))}
        />
        <Select
          label="Laundry Area"
          name="laundry"
          value={queryStates.laundry || ""}
          onChange={handleChange}
          options={Object.values(LaundryAvailability).map((value) => ({
            label: formatEnumValue(value), // formatOdoUnit
            value,
          }))}
        />
        <Select
          label="Caretaker"
          name="caretaker"
          value={queryStates.caretaker || ""}
          onChange={handleChange}
          options={Object.values(CaretakerAvailability).map((value) => ({
            label: formatEnumValue(value), // formatOdoUnit
            value,
          }))}
        />
        <Select
          label="Kitchen Area"
          name="kitchen"
          value={queryStates.kitchen || ""}
          onChange={handleChange}
          options={Object.values(KitchenAvailability).map((value) => ({
            label: formatEnumValue(value), // formatOdoUnit
            value,
          }))}
        />
        <Select
          label="Wifi"
          name="wifi"
          value={queryStates.wifi || ""}
          onChange={handleChange}
          options={Object.values(WifiAvailability).map((value) => ({
            label: formatEnumValue(value), // formatOdoUnit
            value,
          }))}
        />
        <Select
          label="Pets"
          name="pets"
          value={queryStates.pets || ""}
          onChange={handleChange}
          options={Object.values(PetPolicy).map((value) => ({
            label: formatEnumValue(value), // formatOdoUnit
            value,
          }))}
        />
        <Select
          label="Utilities"
          name="utilities"
          value={queryStates.utilities || ""}
          onChange={handleChange}
          options={Object.values(UtilityInclusion).map((value) => ({
            label: formatEnumValue(value), // formatOdoUnit
            value,
          }))}
        />
      </div>
    </div>
  );
};
