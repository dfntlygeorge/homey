"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { NativeSelect } from "../ui/native-select";
import { Settings2, X } from "lucide-react";
import { formatEnumValue } from "@/lib/utils";
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

interface PropertyDetailsModalProps {
  queryStates: {
    roomType: string;
    genderPolicy: string;
    curfew: string;
    laundry: string;
    caretaker: string;
    kitchen: string;
    wifi: string;
    pets: string;
    utilities: string;
  };
  onApply: (filters: Partial<PropertyDetailsModalProps["queryStates"]>) => void;
  activeFiltersCount: number;
}

export const PropertyDetailsModal = ({
  queryStates,
  onApply,
  activeFiltersCount,
}: PropertyDetailsModalProps) => {
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(queryStates);

  const handleChange = (name: string, value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    onApply(tempFilters);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempFilters(queryStates);
    setOpen(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      roomType: "",
      genderPolicy: "",
      curfew: "",
      laundry: "",
      caretaker: "",
      kitchen: "",
      wifi: "",
      pets: "",
      utilities: "",
    };
    setTempFilters(clearedFilters);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-10 text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span>Property Details</span>
          </div>
          {activeFiltersCount > 0 && (
            <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 text-xs font-medium">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Property Details & Filters
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              Property Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NativeSelect
                label="Room Type"
                name="roomType"
                value={tempFilters.roomType || ""}
                onChange={(e) => handleChange("roomType", e.target.value)}
                options={Object.values(RoomType).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="Gender Policy"
                name="genderPolicy"
                value={tempFilters.genderPolicy || ""}
                onChange={(e) => handleChange("genderPolicy", e.target.value)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NativeSelect
                label="Curfew Policy"
                name="curfew"
                value={tempFilters.curfew || ""}
                onChange={(e) => handleChange("curfew", e.target.value)}
                options={Object.values(CurfewPolicy).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="Pet Policy"
                name="pets"
                value={tempFilters.pets || ""}
                onChange={(e) => handleChange("pets", e.target.value)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NativeSelect
                label="Kitchen Availability"
                name="kitchen"
                value={tempFilters.kitchen || ""}
                onChange={(e) => handleChange("kitchen", e.target.value)}
                options={Object.values(KitchenAvailability).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="Laundry Facilities"
                name="laundry"
                value={tempFilters.laundry || ""}
                onChange={(e) => handleChange("laundry", e.target.value)}
                options={Object.values(LaundryAvailability).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="WiFi Access"
                name="wifi"
                value={tempFilters.wifi || ""}
                onChange={(e) => handleChange("wifi", e.target.value)}
                options={Object.values(WifiAvailability).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="Caretaker Service"
                name="caretaker"
                value={tempFilters.caretaker || ""}
                onChange={(e) => handleChange("caretaker", e.target.value)}
                options={Object.values(CaretakerAvailability).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />

              <NativeSelect
                label="Utilities Included"
                name="utilities"
                value={tempFilters.utilities || ""}
                onChange={(e) => handleChange("utilities", e.target.value)}
                options={Object.values(UtilityInclusion).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                }))}
                className="space-y-2"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
