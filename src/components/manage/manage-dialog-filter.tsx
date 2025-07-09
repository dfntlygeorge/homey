"use client";

import { EXCLUDED_KEYS } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, DateRangeFilter } from "@/config/types";
import { env } from "@/env";
import { Search, Archive, FolderOpen, Settings2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { ChangeEvent, useEffect, useState } from "react";
import { SearchInput } from "../shared/search-input";
import { NativeSelect } from "../ui/native-select";
import { ListingStatus } from "@prisma/client";
import { cn, formatEnumValue } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface ManageDialogFiltersProps extends AwaitedPageProps {
  archivedCount?: number;
  count?: number;
}

export const ManageDialogFilters = (props: ManageDialogFiltersProps) => {
  const { searchParams, archivedCount = 0, count = 0 } = props;
  const router = useRouter();
  const pathname = usePathname();

  const baseRoute = pathname.startsWith("/admin")
    ? routes.admin
    : routes.manage;

  const [isOpen, setIsOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  const [queryStates, setQueryStates] = useQueryStates(
    {
      status: parseAsString.withDefault(""),
      dateRange: parseAsString.withDefault(""),
      view: parseAsString.withDefault("active"),
    },
    {
      shallow: false,
    }
  );

  const isViewingArchived = queryStates.view === "archived";

  useEffect(() => {
    const filterCount = Object.entries(
      searchParams as Record<string, string>
    ).filter(
      ([key, value]) => !EXCLUDED_KEYS.includes(key) && value && key !== "view"
    ).length;
    setFilterCount(filterCount);
  }, [searchParams]);

  const clearFilters = () => {
    const url = new URL(baseRoute, env.NEXT_PUBLIC_APP_URL);
    // Preserve the view state when clearing filters
    if (isViewingArchived) {
      url.searchParams.set("view", "archived");
    }
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

  const toggleView = (view: "active" | "archived") => {
    setQueryStates({
      view,
      // Clear other filters when switching views for better UX
      status: "",
      dateRange: "",
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
          {/* Header */}
          <div>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-lg font-semibold">
                Filters
              </DialogTitle>
              {filterCount > 0 && (
                <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 text-xs font-medium">
                  {filterCount}
                </span>
              )}
            </div>
            <div className="mt-2" />
          </div>

          {/* View Toggle Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">View</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleView("active")}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-all duration-200 border",
                  !isViewingArchived
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background/50 text-muted-foreground border-border hover:bg-background hover:text-foreground"
                )}
              >
                <FolderOpen className="h-4 w-4" />
                <span>Active</span>
              </button>
              <button
                onClick={() => toggleView("archived")}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-all duration-200 border relative",
                  isViewingArchived
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background/50 text-muted-foreground border-border hover:bg-background hover:text-foreground"
                )}
              >
                <Archive className="h-4 w-4" />
                <span>Archived</span>
                {archivedCount > 0 && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 h-5 w-5 text-xs rounded-full flex items-center justify-center",
                      isViewingArchived
                        ? "bg-primary-foreground text-primary"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {archivedCount > 99 ? "99+" : archivedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Properties
            </label>
            <SearchInput
              placeholder={`Search ${
                isViewingArchived ? "archived" : "active"
              } listings...`}
              className="w-full rounded-lg border-input bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-md"
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Listing Status
            </h3>
            <NativeSelect
              label=""
              name="status"
              value={queryStates.status || ""}
              onChange={handleChange}
              options={[
                { label: "All Statuses", value: "" },
                ...Object.values(ListingStatus).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                })),
              ]}
              className="w-full rounded-lg border-input bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-md"
            />
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Date Range
            </h3>
            <NativeSelect
              label=""
              name="dateRange"
              value={queryStates.dateRange || ""}
              onChange={handleChange}
              options={[
                { label: "All Time", value: "" },
                ...Object.values(DateRangeFilter).map((value) => ({
                  label: formatEnumValue(value),
                  value,
                })),
              ]}
              className="w-full rounded-lg border-input bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-md"
            />
          </div>

          {/* Archive Info Banner */}
          {isViewingArchived && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Archive className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Viewing Archived Listings
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    These listings are hidden from public view. You can
                    unarchive them to make them active again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Apply Filters {count > 0 ? `(${count})` : null}
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
