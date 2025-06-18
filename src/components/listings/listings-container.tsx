"use client";

import { AwaitedPageProps, ListingWithImages } from "@/config/types";
import { use } from "react";
import { ListingCard } from "./listing-card";
import { EXCLUDED_KEYS } from "@/config/constants";
import { EmptyListingMessage } from "./empty-listing-message";

interface ListingsContainerProps {
  listings: Promise<ListingWithImages[]>;
  favourites: number[];
  searchParams: AwaitedPageProps["searchParams"];
}

export const ListingsContainer = (props: ListingsContainerProps) => {
  const { listings, favourites, searchParams } = props;
  const resolvedListings = use(listings);
  const hasFilters = Object.entries(searchParams || {}).some(
    ([key, value]) => !EXCLUDED_KEYS.includes(key) && value
  );

  return (
    <>
      {resolvedListings.length === 0 ? (
        <EmptyListingMessage hasFilters={hasFilters} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {resolvedListings.map((listing) => (
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
    // <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
    //   {listings.map((property) => {
    //     return (
    //       <ListingCard
    //         key={property.id}
    //         property={property}
    //         favourites={favourites}
    //         searchParams={searchParams}
    //       />
    //     );
    //   })}
    // </div>
  );
};
