import { PropertyListings } from "@/components/properties/property-listings";
import { Sidebar } from "@/components/properties/sidebar";
import { AwaitedPageProps, Favourites } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { buildClassifiedFilterQuery } from "@/lib/utils";

const getListings = async (searchParams: AwaitedPageProps["searchParams"]) => {
  return prisma.listing.findMany({
    where: buildClassifiedFilterQuery(searchParams), // where clause to filter the records.
    include: {
      images: { take: 1 }, // just take 1 since we dont have a carousel so it's useless to return all of them
    },
  });
};

export default async function ListingsPage(props: AwaitedPageProps) {
  const searchParams = await props.searchParams;
  const listings = getListings(searchParams);

  const minMaxResult = await prisma.listing.aggregate({
    // aggregate() function is prisma performs aggregations like min, max, sum, avg, etc on a table.
    _min: {
      rent: true,
    },
    _max: {
      rent: true,
    },
  });
  const sourceId = await getSourceId();
  //   get the favourites from redis.
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  console.log(favourites);

  return (
    <div className="flex">
      <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />
      <div className="flex-1 p-4">
        <PropertyListings
          properties={listings}
          favourites={favourites ? favourites.ids : []}
        />
      </div>
    </div>
  );
}
