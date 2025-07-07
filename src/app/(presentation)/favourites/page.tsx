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
      address: true,
    },
  });

  const count = await prisma.listing.count({
    where: { id: { in: favourites ? favourites.ids : [] } }, // where the id field matches any value in the provided array.
  });

  return (
    <div className="container mx-auto min-h-[80dvh] px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Saved Listings</h1>
        {count > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {count} saved {count === 1 ? "listing" : "listings"}
          </p>
        )}
      </div>

      {count === 0 ? (
        <EmptyFavouritesMessage />
      ) : (
        <Suspense fallback={<FavouritesSkeleton />}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                favourites={favourites ? favourites.ids : []}
              />
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}
