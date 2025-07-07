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
import { Settings2, X } from "lucide-react";
import { FilterCheckbox } from "./filter-checkbox";

interface RulesAmenitiesModalProps {
  queryStates: {
    curfew: string;
    laundry: string;
    caretaker: string;
    kitchen: string;
    wifi: string;
    pets: string;
    utilities: string;
  };
  onApply: (filters: Partial<RulesAmenitiesModalProps["queryStates"]>) => void;
  activeFiltersCount: number;
}

export const RulesAmenitiesModal = ({
  queryStates,
  onApply,
  activeFiltersCount,
}: RulesAmenitiesModalProps) => {
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    curfew: queryStates.curfew === "HAS_CURFEW",
    laundry: queryStates.laundry === "AVAILABLE",
    caretaker: queryStates.caretaker === "AVAILABLE",
    kitchen: queryStates.kitchen === "AVAILABLE",
    wifi: queryStates.wifi === "AVAILABLE",
    pets: queryStates.pets === "ALLOWED",
    utilities: queryStates.utilities === "INCLUDED",
  });

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setTempFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleApply = () => {
    const mappedFilters = {
      curfew: tempFilters.curfew ? "HAS_CURFEW" : "",
      laundry: tempFilters.laundry ? "AVAILABLE" : "",
      caretaker: tempFilters.caretaker ? "AVAILABLE" : "",
      kitchen: tempFilters.kitchen ? "AVAILABLE" : "",
      wifi: tempFilters.wifi ? "AVAILABLE" : "",
      pets: tempFilters.pets ? "ALLOWED" : "",
      utilities: tempFilters.utilities ? "INCLUDED" : "",
    };
    onApply(mappedFilters);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempFilters({
      curfew: queryStates.curfew === "HAS_CURFEW",
      laundry: queryStates.laundry === "AVAILABLE",
      caretaker: queryStates.caretaker === "AVAILABLE",
      kitchen: queryStates.kitchen === "AVAILABLE",
      wifi: queryStates.wifi === "AVAILABLE",
      pets: queryStates.pets === "ALLOWED",
      utilities: queryStates.utilities === "INCLUDED",
    });
    setOpen(false);
  };

  const handleClear = () => {
    setTempFilters({
      curfew: false,
      laundry: false,
      caretaker: false,
      kitchen: false,
      wifi: false,
      pets: false,
      utilities: false,
    });
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
            <span>Rules & Amenities</span>
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
            Rules & Amenities
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rules & Policies */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              Rules & Policies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FilterCheckbox
                id="curfew-modal"
                label="Has Curfew"
                checked={tempFilters.curfew}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("curfew", checked)
                }
              />

              <FilterCheckbox
                id="pets-modal"
                label="Pets Allowed"
                checked={tempFilters.pets}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("pets", checked)
                }
              />
            </div>
          </div>

          {/* Amenities & Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              Amenities & Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FilterCheckbox
                id="kitchen-modal"
                label="Kitchen Available"
                checked={tempFilters.kitchen}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("kitchen", checked)
                }
              />

              <FilterCheckbox
                id="laundry-modal"
                label="Laundry Available"
                checked={tempFilters.laundry}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("laundry", checked)
                }
              />

              <FilterCheckbox
                id="wifi-modal"
                label="WiFi Available"
                checked={tempFilters.wifi}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("wifi", checked)
                }
              />

              <FilterCheckbox
                id="caretaker-modal"
                label="Caretaker Available"
                checked={tempFilters.caretaker}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("caretaker", checked)
                }
              />

              <FilterCheckbox
                id="utilities-modal"
                label="Utilities Included"
                checked={tempFilters.utilities}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("utilities", checked)
                }
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
