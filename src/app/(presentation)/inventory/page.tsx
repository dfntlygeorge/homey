import { PropertyListings } from "@/components/properties/property-listings";
import { Sidebar } from "@/components/properties/sidebar";
import { AwaitedPageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { buildClassifiedFilterQuery } from "@/lib/utils";

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  return prisma.listing.findMany({
    where: buildClassifiedFilterQuery(searchParams), // where clause to filter the records.
    include: {
      images: { take: 1 }, // just take 1 since we dont have a carousel so it's useless to return all of them
    },
  });
};

export default async function InventoryPage(props: AwaitedPageProps) {
  const searchParams = await props.searchParams;
  const listings = getInventory(searchParams);

  const minMaxResult = await prisma.listing.aggregate({
    // aggregate() function is prisma performs aggregations like min, max, sum, avg, etc on a table.
    _min: {
      rent: true,
    },
    _max: {
      rent: true,
    },
  });

  return (
    <div className="flex">
      <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />
      <div className="flex-1 p-4">
        <PropertyListings properties={listings} />
      </div>
    </div>
  );
}
