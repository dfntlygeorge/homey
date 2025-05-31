"use client";

import { PropertyWithImages } from "@/config/types";
import { use } from "react";
import { ListingCard } from "./listing-card";

interface PropertyListProps {
  properties: Promise<PropertyWithImages[]>;
  favourites: number[];
}

export const PropertyListings = (props: PropertyListProps) => {
  const { properties, favourites } = props;
  const listings = use(properties);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {listings.map((property) => {
        return (
          <ListingCard
            key={property.id}
            property={property}
            favourites={favourites}
          />
        );
      })}
    </div>
  );
};
