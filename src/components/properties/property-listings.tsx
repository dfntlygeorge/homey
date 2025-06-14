"use client";

import { AwaitedPageProps, PropertyWithImages } from "@/config/types";
import { use } from "react";
import { ListingCard } from "./listing-card";

interface PropertyListProps {
  properties: Promise<PropertyWithImages[]>;
  favourites: number[];
  searchParams: AwaitedPageProps["searchParams"];
}

export const PropertyListings = (props: PropertyListProps) => {
  const { properties, favourites, searchParams } = props;
  const listings = use(properties);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {listings.map((property) => {
        return (
          <ListingCard
            key={property.id}
            property={property}
            favourites={favourites}
            searchParams={searchParams}
          />
        );
      })}
    </div>
  );
};
