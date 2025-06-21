"use client";

import { EXCLUDED_KEYS } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, DateRangeFilter } from "@/config/types";
import { env } from "@/env";
import { Filter, X, Search, Archive, FolderOpen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { ChangeEvent, useEffect, useState } from "react";
import { SearchInput } from "../shared/search-input";
import { NativeSelect } from "../ui/native-select";
import { ListingStatus } from "@prisma/client";
import { cn, formatEnumValue } from "@/lib/utils";

export const ManageSidebar = (
  props: AwaitedPageProps & { archivedCount?: number }
) => {
  const { searchParams, archivedCount = 0 } = props;
  const router = useRouter();
  const pathname = usePathname();

  const baseRoute = pathname.startsWith("/admin")
    ? routes.admin
    : routes.manage;
  const [filterCount, setFilterCount] = useState(0);
  const [queryStates, setQueryStates] = useQueryStates(
    {
      status: parseAsString.withDefault(""),
      dateRange: parseAsString.withDefault(""),
      view: parseAsString.withDefault("active"), // Add view state for active/archived
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
    <div className="hidden w-[26rem] border-r border-border/60 bg-gradient-to-b from-card to-card/50 lg:flex lg:flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border/60">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              {filterCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {filterCount} active filter{filterCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              !filterCount
                ? "text-muted-foreground cursor-not-allowed opacity-50 bg-muted/30"
                : "text-destructive hover:text-destructive-foreground hover:bg-destructive/10 border border-transparent hover:border-destructive/20 cursor-pointer"
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
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {/* View Toggle Section */}
        <div className="p-6 border-b border-border/40">
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
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-border/40">
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
        </div>

        {/* Filters Section */}
        <div className="p-6 space-y-8">
          {/* Status Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center">
              Listing Status
            </h3>
            <div className="space-y-2">
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
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center">
              Date Range
            </h3>
            <div className="space-y-2">
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

          {/* Filter Summary */}
          {filterCount > 0 && (
            <div className="pt-4 border-t border-border/40">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">
                      {filterCount} Filter{filterCount !== 1 ? "s" : ""} Applied
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Showing filtered results
                    </p>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:text-primary/80 underline underline-offset-2"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 p-6">
        <div className="text-xs text-muted-foreground">
          <p>
            {isViewingArchived
              ? "Archived listings are hidden from public view"
              : "Use filters to quickly find specific listings"}
          </p>
        </div>
      </div>
    </div>
  );
};
