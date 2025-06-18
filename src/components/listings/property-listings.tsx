"use client";

import { AwaitedPageProps, PropertyWithImages } from "@/config/types";
import { use } from "react";
import { ListingCard } from "./listing-card";
import { EXCLUDED_KEYS } from "@/config/constants";
import { EmptyListingMessage } from "./empty-listing";

interface PropertyListProps {
  properties: Promise<PropertyWithImages[]>;
  favourites: number[];
  searchParams: AwaitedPageProps["searchParams"];
}

export const PropertyListings = (props: PropertyListProps) => {
  const { properties, favourites, searchParams } = props;
  const listings = use(properties);
  const hasFilters = Object.entries(searchParams || {}).some(
    ([key, value]) => !EXCLUDED_KEYS.includes(key) && value
  );
  console.log(hasFilters);
  console.log("is this running");
  console.log(listings.length);
  return (
    <>
      {listings.length === 0 ? (
        <EmptyListingMessage hasFilters={hasFilters} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {listings.map((property) => (
            <ListingCard
              key={property.id}
              property={property}
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
