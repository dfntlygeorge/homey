import { PropertyListings } from "@/components/properties/property-listings";
import { SearchInput } from "@/components/shared/search-input";
import { AwaitedPageProps } from "@/config/types";
import prisma from "@/lib/prisma";

export default async function InventoryPage(props: AwaitedPageProps) {
  const searchParams = await props.searchParams;
  const q =
    typeof searchParams?.q === "string" ? searchParams.q.toLowerCase() : "";

  const properties = prisma.listing.findMany({
    where: q
      ? {
          OR: [
            { location: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { title: { contains: q, mode: "insensitive" } },
          ],
        }
      : {},
    include: {
      images: { take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <SearchInput />
      <PropertyListings properties={properties} />
    </div>
  );
}
