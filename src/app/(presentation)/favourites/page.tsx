import { ListingCard } from "@/components/properties/listing-card";
import { Favourites } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";

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
      <h1 className="mb-6 text-3xl font-bold">Your Favourite Classifieds</h1>
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-lg text-gray-600">
            You have not saved any classifieds yet.
          </p>
          <p className="text-gray-500">
            Browse our inventory and click the heart icon to add favourites.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                property={listing}
                favourites={favourites ? favourites.ids : []}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
