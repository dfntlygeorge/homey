import { EmptyFavouritesMessage } from "@/components/listings/empty-favourites-message";
import { FavouritesSkeleton } from "@/components/listings/skeleton/favourites-skeleton";
import { ListingCard } from "@/components/listings/listing-card";
import { Favourites } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { Suspense } from "react";

export default async function FavouritesPage() {
  const sourceId = await getSourceId();
  //   get the favourites from redis.
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  const listings = await prisma.listing.findMany({
    where: { id: { in: favourites ? favourites.ids : [] } }, // where clause to filter the records.
    include: {
      images: { take: 1 }, // just take 1 since we dont have a carousel so it's useless to return all of them
    },
  });

  const count = await prisma.listing.count({
    where: { id: { in: favourites ? favourites.ids : [] } }, // where the id field matches any value in the provided array.
  });

  return (
    <div className="container mx-auto min-h-[80dvh] px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Saved Listings</h1>
      {count === 0 ? (
        <EmptyFavouritesMessage />
      ) : (
        <Suspense fallback={<FavouritesSkeleton />}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                property={listing}
                favourites={favourites ? favourites.ids : []}
              />
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}
