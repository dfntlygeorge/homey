"use client";

import { AwaitedPageProps, ListingWithImages } from "@/config/types";
import { ListingCard } from "./listing-card";
import { EXCLUDED_KEYS } from "@/config/constants";
import { EmptyListingMessage } from "./empty-listing-message";

interface ListingsContainerProps {
  listings: ListingWithImages[]; // Previously Promise<ListingWIthImages[]>
  favourites: number[];
  searchParams: AwaitedPageProps["searchParams"];
}

export const ListingsContainer = (props: ListingsContainerProps) => {
  const { listings, favourites, searchParams } = props;
  // Uses use hook from react to resolved. like const resolvedListings = use(listings)
  const hasFilters = Object.entries(searchParams || {}).some(
    ([key, value]) => !EXCLUDED_KEYS.includes(key) && value
  );

  return (
    <>
      {listings.length === 0 ? (
        <EmptyListingMessage hasFilters={hasFilters} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              favourites={favourites}
              searchParams={searchParams}
            />
          ))}
        </div>
      )}
    </>
  );
};
