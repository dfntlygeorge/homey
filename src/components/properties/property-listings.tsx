"use client";

import { PropertyWithImages } from "@/config/types";
import { use } from "react";
import { ListingCard } from "./property-card";

interface PropertyListProps {
  properties: Promise<PropertyWithImages[]>;
}

export const PropertyListings = (props: PropertyListProps) => {
  const { properties } = props;
  const inventory = use(properties);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {inventory.map((property) => {
        return <ListingCard key={property.id} property={property} />;
      })}
    </div>
  );
};
