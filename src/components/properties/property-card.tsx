"use client";

import { PropertyWithImages } from "@/config/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { routes } from "@/config/routes";
import { formatEnumValue, formatPrice } from "@/lib/utils";

interface ListingCardProps {
  property: PropertyWithImages;
}

export const ListingCard = (props: ListingCardProps) => {
  const { property } = props;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg bg-background shadow-md border border-border">
      <div className="relative aspect-3/2">
        <Link href="#">
          <Image
            src={property.images[0].url}
            alt={property.title}
            fill={true}
            className="rounded-t-md object-cover"
          />
        </Link>
      </div>
      <div className="flex flex-col space-y-3 p-4">
        <div>
          <Link
            href="#"
            className="line-clamp-1 text-sm font-semibold hover:underline text-foreground md:text-base lg:text-lg"
          >
            {property.title}
          </Link>
          <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm xl:text-base">
            {property.description}
          </p>
          <ul className="mt-1 grid w-full grid-cols-2 grid-rows-2 items-center justify-between text-xs text-muted-foreground md:text-sm ">
            <li className="flex items-center gap-x-1.5 font-semibold xl:flex-col">
              📍 <span className="line-clamp-1">{property.location}</span>
            </li>
            <li className="flex items-center gap-x-1.5 font-semibold xl:flex-col">
              💸{" "}
              <span className="line-clamp-1">{formatPrice(property.rent)}</span>
            </li>
            <li className="flex items-center gap-x-1.5 font-semibold xl:flex-col">
              🛏️{" "}
              <span className="line-clamp-1">
                {formatEnumValue(property.roomType)}
              </span>
            </li>
            <li className="flex items-center gap-x-1.5 font-semibold xl:flex-col">
              👥
              <span className="line-clamp-1">
                {property.slotsAvailable} slots
              </span>
            </li>
          </ul>
        </div>
        <div className="mt-4 flex w-full flex-col space-y-2 lg:flex-row lg:space-y-0 lg:gap-x-2">
          <Button
            className="h-full flex-1 py-2 text-xs md:text-sm lg:py-2.5 xl:text-base"
            asChild
            variant="outline"
            size="sm"
          >
            <Link href={routes.reserve(property.id)}>Reserve</Link>
          </Button>

          <Button
            className="h-full flex-1 py-2 text-xs md:text-sm lg:py-2.5 xl:text-base"
            asChild
            size="sm"
          >
            <Link href={routes.singleProperty(property.id)}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
