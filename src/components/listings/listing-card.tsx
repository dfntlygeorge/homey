"use client";

import { AwaitedPageProps, ListingWithImagesAndAddress } from "@/config/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button"; // Assuming this is your ShadCN UI Button or similar
import { routes } from "@/config/routes";
import { getDistanceBetweenPoints } from "@/lib/proximity-filter";
import { MapPin, BadgeDollarSign, Bed, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FavouriteButton } from "./favourite-button";
import { formatEnumValue, formatPrice } from "@/lib/utils";
import { startConversationWithOwner } from "@/app/_actions/chats/start-conversation";
import { toast } from "sonner";

interface ListingCardProps {
  listing: ListingWithImagesAndAddress;
  favourites: number[];
  searchParams?: AwaitedPageProps["searchParams"];
}

export const ListingCard = (props: ListingCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { listing, favourites, searchParams } = props;
  const {
    id,
    title,
    images,
    description,
    address,
    rent,
    roomType,
    slotsAvailable,
  } = listing;

  // gets us the current pathname
  const pathname = usePathname();

  const [isFavourite, setIsFavourite] = useState(
    favourites.includes(listing.id) // check if the classified is in the favourites array
  );

  const [isVisible, setIsVisible] = useState(true);
  const centerLat = Number(searchParams?.latitude);
  const centerLon = Number(searchParams?.longitude);

  const distance = getDistanceBetweenPoints(
    centerLat,
    centerLon,
    address.latitude,
    address.longitude
  );

  const handleContactOwner = async () => {
    setIsLoading(true);

    try {
      const result = await startConversationWithOwner(id, listing.userId);

      if (result && !result.success) {
        toast.error(result.message);
      } else if (result && result.conversationId) {
        // Now do client-side redirect
        router.push(routes.chat(result.conversationId));
      }
    } catch (error) {
      console.error("Error contacting owner:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative flex flex-col overflow-hidden rounded-lg bg-background shadow-md border border-border group h-full">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Link href={routes.listing(id)} passHref>
                <Image
                  src={images?.[0]?.url || "/placeholder-property.jpg"}
                  alt={title}
                  fill={true}
                  className="rounded-t-md object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </Link>

              {/* Distance badge - positioned over the image with better visibility */}
              {distance && (
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg border border-white/20 z-10">
                  {distance.toFixed(1)}km away
                </div>
              )}

              <FavouriteButton
                setIsFavourite={setIsFavourite}
                isFavourite={isFavourite}
                id={id}
              />
            </div>

            <div className="flex flex-1 flex-col p-4 space-y-3">
              {/* Title and Description */}
              <div className="space-y-2">
                <Link
                  href={routes.listing(id)}
                  passHref
                  className="block"
                  title={title}
                >
                  <h3 className="line-clamp-1 text-base font-semibold hover:underline text-foreground transition-colors">
                    {title}
                  </h3>
                </Link>
                <p
                  className="line-clamp-2 text-sm text-muted-foreground leading-relaxed"
                  title={description}
                >
                  {description}
                </p>
              </div>

              {/* Property Details */}
              <div className="space-y-1">
                {/* Location */}
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground line-clamp-1 font-medium">
                    {address.formattedAddress}
                  </span>
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1.5">
                    <BadgeDollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-foreground">
                      {formatPrice(rent)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1.5">
                    <Bed className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-foreground">
                      {formatEnumValue(roomType)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1.5">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-foreground">
                      {slotsAvailable} {slotsAvailable === 1 ? "slot" : "slots"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto pt-1 flex  gap-2">
                <Button
                  className="flex-1 h-9"
                  onClick={handleContactOwner}
                  disabled={isLoading}
                  size="sm"
                  variant={"outline"}
                >
                  {isLoading ? "Connecting..." : "Message"}
                </Button>
                <Button className="flex-1 h-9" asChild size="sm">
                  <Link href={routes.listing(id)}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
