import { DialogFilters } from "@/components/properties/dialog-filters";
import { ListingsSkeleton } from "@/components/properties/listings-skeleton";
import { PropertyListings } from "@/components/properties/property-listings";
import { Sidebar } from "@/components/properties/sidebar";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { LISTINGS_PER_PAGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, Favourites } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { getFilteredListings } from "@/lib/listing-filter";
import { Suspense } from "react";

export default async function ListingsPage(props: AwaitedPageProps) {
  const searchParams = await props.searchParams;
  const listings = getFilteredListings(searchParams);
  const count = (await listings).length;

  const totalPages = Math.ceil(count / LISTINGS_PER_PAGE);

  const minMaxResult = await prisma.listing.aggregate({
    // aggregate() function is prisma performs aggregations like min, max, sum, avg, etc on a table.
    _min: {
      rent: true,
    },
    _max: {
      rent: true,
    },
  });
  const sourceId = await getSourceId();
  //   get the favourites from redis.
  const favourites = await redis.get<Favourites>(sourceId ?? "");

  return (
    <div className="flex">
      <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />
      <div className="flex-1 p-4">
        <div className="-mt-1 flex flex-col items-center justify-between space-y-2 pb-4">
          <div className="flex w-full items-center justify-between">
            <h2 className="min-w-fit text-sm font-semibold md:text-base lg:text-xl">
              We have found {count} {count <= 1 ? "listing" : "listings"}...
            </h2>
            <DialogFilters
              minMaxValues={minMaxResult}
              searchParams={searchParams}
              count={count}
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

        {/* TODO: Add skeleton loading fallback when Suspense is used */}
        <Suspense fallback={<ListingsSkeleton />}>
          <PropertyListings
            properties={listings}
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
