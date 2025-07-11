import { DialogFilters } from "@/components/listings/dialog-filters";
import { ListingsSkeleton } from "@/components/listings/skeleton/listings-skeleton";
import { ListingsContainer } from "@/components/listings/listings-container";
import { Sidebar } from "@/components/listings/sidebar";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { routes } from "@/config/routes";
import { Favourites, PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { getFilteredListingsWithCount } from "@/lib/listing-filter";
import { Suspense } from "react";

export default async function ListingsPage(props: PageProps) {
  const searchParams = await props.searchParams;

  // Run ALL queries in parallel
  const [{ listings, totalCount, totalPages }, minMaxResult, sourceId] =
    await Promise.all([
      getFilteredListingsWithCount(searchParams),
      prisma.listing.aggregate({
        _min: { rent: true },
        _max: { rent: true },
      }),
      getSourceId(),
    ]);
  // Get the favourites from redis
  const favourites = await redis.get<Favourites>(sourceId ?? "");

  return (
    <div className="flex">
      <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />
      <div className="flex-1 p-4">
        <div className="-mt-1 flex flex-col items-center justify-between space-y-2 pb-4">
          <div className="flex w-full items-center justify-between">
            <h2 className="min-w-fit text-sm font-semibold md:text-base lg:text-xl">
              We have found {totalCount}{" "}
              {totalCount <= 1 ? "listing" : "listings"}...
            </h2>
            <DialogFilters
              minMaxValues={minMaxResult}
              searchParams={searchParams}
              count={totalCount}
            />
          </div>
          <CustomPagination
            baseUrl={routes.listings}
            totalPages={totalPages}
            styles={{
              paginationRoot: "justify-end hidden lg:block",
              paginationPrevious: "",
              paginationNext: "",
              paginationLink: "border-none active:border",
              paginationLinkActive: "bg-gray-200",
            }}
          />
        </div>

        <Suspense fallback={<ListingsSkeleton />}>
          <ListingsContainer
            listings={listings}
            favourites={favourites ? favourites.ids : []}
            searchParams={searchParams}
          />
        </Suspense>

        <CustomPagination
          baseUrl={routes.listings}
          totalPages={totalPages}
          styles={{
            paginationRoot: "justify-center lg:hidden pt-12",
            paginationPrevious: "",
            paginationNext: "",
            paginationLink: "border-none active:border",
            paginationLinkActive: "bg-gray-200",
          }}
        />
      </div>
    </div>
  );
}
