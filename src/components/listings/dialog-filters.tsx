"use client";

import { routes } from "@/config/routes";
import { SidebarProps } from "@/config/types";
import { EXCLUDED_KEYS } from "@/config/constants";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Settings2 } from "lucide-react";
import { NativeSelect } from "../ui/native-select";
import { cn, formatEnumValue } from "@/lib/utils";
import { GenderPolicy, RoomType } from "@prisma/client";
import { SearchInput } from "../shared/search-input";
import { RangeFilters } from "./range-filters";
import { ProximityFilter } from "./proximity-filter";
import { FilterCheckbox } from "./filter-checkbox";

interface DialogFiltersProps extends SidebarProps {
  count: number;
}

export const DialogFilters = (props: DialogFiltersProps) => {
  const { minMaxValues, searchParams, count } = props;

  const { _min, _max } = minMaxValues;

  const [isOpen, setIsOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const router = useRouter();

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
    },
    {
      shallow: false, // refreshes the data every time the query state changes
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
    router.replace(url.toString());
    setFilterCount(0);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setQueryStates({ [name]: value || null });
    router.refresh();
  };

  const handleCheckboxChange = (
    name: string,
    checked: boolean,
    value: string
  ) => {
    setQueryStates({ [name]: checked ? value : null });
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] max-w-[425px] overflow-y-auto rounded-xl">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-lg font-semibold">
              <DialogTitle>Filters</DialogTitle>
              {filterCount > 0 && (
                <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 text-xs font-medium">
                  {filterCount}
                </span>
              )}
            </div>
            <div className="mt-2" />
          </div>

          {/* Search Input */}
          <SearchInput
            placeholder="Search properties..."
            className="focus:ring-primary w-full rounded-md border py-2 focus:ring-2 focus:outline-hidden"
          />

          {/* Location Filter */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Location & Proximity
            </h3>
            <ProximityFilter
              searchParams={searchParams}
              onLocationChange={handleLocationChange}
            />
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Price Range
            </h3>
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

          {/* Property Details */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Property Details
            </h3>

            <NativeSelect
              label="Room Type"
              name="roomType"
              value={queryStates.roomType || ""}
              onChange={handleChange}
              options={Object.values(RoomType).map((value) => ({
                label: formatEnumValue(value),
                value,
              }))}
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
            />
          </div>

          {/* Rules & Policies */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Rules & Policies
            </h3>

            <div className="space-y-2">
              <FilterCheckbox
                id="curfew"
                label="Has Curfew"
                checked={queryStates.curfew === "HAS_CURFEW"}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("curfew", checked, "HAS_CURFEW")
                }
              />

              <FilterCheckbox
                id="pets"
                label="Pets Allowed"
                checked={queryStates.pets === "ALLOWED"}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("pets", checked, "ALLOWED")
                }
              />
            </div>
          </div>

          {/* Amenities & Services */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Amenities & Services
            </h3>

            <div className="space-y-2">
              <FilterCheckbox
                id="kitchen"
                label="Kitchen Available"
                checked={queryStates.kitchen === "AVAILABLE"}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("kitchen", checked, "AVAILABLE")
                }
              />

              <FilterCheckbox
                id="laundry"
                label="Laundry Available"
                checked={queryStates.laundry === "AVAILABLE"}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("laundry", checked, "AVAILABLE")
                }
              />

              <FilterCheckbox
                id="wifi"
                label="WiFi Available"
                checked={queryStates.wifi === "AVAILABLE"}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("wifi", checked, "AVAILABLE")
                }
              />

              <FilterCheckbox
                id="caretaker"
                label="Caretaker Available"
                checked={queryStates.caretaker === "AVAILABLE"}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("caretaker", checked, "AVAILABLE")
                }
              />

              <FilterCheckbox
                id="utilities"
                label="Utilities Included"
                checked={queryStates.utilities === "INCLUDED"}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("utilities", checked, "INCLUDED")
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Search {count > 0 ? `(${count})` : null}
            </Button>
            {filterCount > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                aria-disabled={!filterCount}
                className={cn(
                  "py-1 text-sm",
                  !filterCount
                    ? "disabled pointer-events-none cursor-default opacity-50"
                    : "hover:underline"
                )}
              >
                Clear all {filterCount ? `(${filterCount})` : null}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
