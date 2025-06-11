"use client";

import { PropertyWithImages } from "@/config/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button"; // Assuming this is your ShadCN UI Button or similar
import { routes } from "@/config/routes";
import { formatEnumValue, formatPrice } from "@/lib/utils";
import { MapPin, BadgeDollarSign, Bed, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FavouriteButton } from "./favourite-button";

interface ListingCardProps {
  property: PropertyWithImages;
  favourites: number[];
}

export const ListingCard = (props: ListingCardProps) => {
  const { property, favourites } = props;
  // gets us the current pathname
  const pathname = usePathname();

  const [isFavourite, setIsFavourite] = useState(
    favourites.includes(property.id) // check if the classified is in the favourites array
  );

  const [isVisible, setIsVisible] = useState(true);
  // hides non-favourite cards on the favourites page
  useEffect(() => {
    if (!isFavourite && pathname === routes.favourites) setIsVisible(false);
  }, [isFavourite, pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md"
        >
          <div className="relative flex flex-col overflow-hidden rounded-lg bg-background shadow-md border border-border group h-full">
            {" "}
            {/* Added group for hover effects & h-full for consistent height in a grid */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {" "}
              {/* Consider aspect-video or aspect-[16/10] for a less elongated image area than 3/2 */}
              <Link href={routes.singleProperty(property.id)} passHref>
                <Image
                  src={property.images?.[0]?.url || "/placeholder-property.jpg"} // Optional chaining and a fallback image
                  alt={property.title}
                  fill={true}
                  className="rounded-t-md object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" // Subtle zoom on hover
                />
              </Link>
              <FavouriteButton
                setIsFavourite={setIsFavourite}
                isFavourite={isFavourite}
                id={property.id}
              />
            </div>
            {/* Flex-1 will make this content area take available space, helping with card elongation */}
            <div className="flex flex-1 flex-col p-3 md:p-4 space-y-2.5">
              {" "}
              {/* Adjusted padding and spacing */}
              <div>
                <Link
                  href={routes.singleProperty(property.id)}
                  passHref
                  className="block" // Ensure link takes block for proper clamping
                  title={property.title} // Show full title on hover if clamped
                >
                  <h3 className="line-clamp-1 text-sm font-semibold hover:underline text-foreground md:text-base lg:text-base">
                    {" "}
                    {/* Slightly adjusted lg size */}
                    {property.title}
                  </h3>
                </Link>
                <p
                  className="line-clamp-2 text-xs text-muted-foreground mt-1 md:text-sm"
                  title={property.description} // Show full description on hover if clamped
                >
                  {property.description}
                </p>
              </div>
              {/* Revised Features Section */}
              <div className="mt-1.5 space-y-1.5 text-xs text-muted-foreground md:text-sm">
                {/* Location: Given more prominence and better wrapping */}
                <div className="flex items-start gap-x-1.5">
                  <MapPin className="mt-[1px] h-4 w-4 md:mt-[2px] text-muted-foreground" />
                  <span className="font-medium line-clamp-1">
                    {property.address}
                  </span>
                </div>

                {/* Other features: Using flex-wrap for better responsiveness */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                  <div className="flex items-center gap-x-1.5 font-medium">
                    <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="line-clamp-1">
                      {formatPrice(property.rent)}
                    </span>
                  </div>

                  <div className="flex items-center gap-x-1.5 font-medium">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span className="line-clamp-1">
                      {formatEnumValue(property.roomType)}
                    </span>
                  </div>

                  <div className="flex items-center gap-x-1.5 font-medium">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="line-clamp-1">
                      {property.slotsAvailable}{" "}
                      {property.slotsAvailable === 1 ? "slot" : "slots"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Buttons: mt-auto pushes them to the bottom of the card */}
              <div className="mt-auto pt-3 flex w-full flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-x-2">
                <Button
                  className="h-auto flex-1 py-2 text-xs md:text-sm" // Adjusted padding, base lg:text-base might be too large for buttons
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <Link href={routes.reserve(property.id)}>Reserve</Link>
                </Button>
                <Button
                  className="h-auto flex-1 py-2 text-xs md:text-sm"
                  asChild
                  size="sm"
                >
                  <Link href={routes.singleProperty(property.id)}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
