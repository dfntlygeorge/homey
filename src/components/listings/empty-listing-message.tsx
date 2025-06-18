"use client";

import { routes } from "@/config/routes";
import { Building2 } from "lucide-react";
import Link from "next/link";

export const EmptyListingMessage = ({
  hasFilters,
}: {
  hasFilters: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        <Building2 className="h-24 w-24 text-gray-300" />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasFilters
          ? "No listings match your criteria"
          : "No listings available"}
      </h3>

      <p className="text-gray-600 mb-6 max-w-md">
        {hasFilters
          ? "Try adjusting your filters to see more results, or check back later for new listings."
          : "We don't have any property listings available at the moment. Please check back later."}
      </p>

      {hasFilters && (
        <div className="flex">
          <Link
            href={routes.listings}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All Listings
          </Link>
        </div>
      )}
    </div>
  );
};
