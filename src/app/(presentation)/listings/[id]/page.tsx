import { ListingView } from "@/components/listings/listing-view";
import { Favourites, PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { notFound } from "next/navigation";

export default async function ListingPage(props: PageProps) {
  const params = await props.params;
  const id = Number(params?.id);
  const sourceId = await getSourceId();

  if (!id) notFound();

  const listing = await prisma.listing.findUnique({
    where: { id, status: "APPROVED", isArchived: false, isAvailable: true },
    include: {
      images: true,
      address: {
        include: {
          reviews: {
            include: {
              user: true,
            },
          },
        },
      },
      user: true,
    },
  });

  if (!listing) notFound();
  const favourites = await redis.get<Favourites>(sourceId ?? "");
  const isFavourite = favourites?.ids.includes(listing.id);
  console.log(isFavourite);
  return <ListingView listing={listing} isFavourite={isFavourite || false} />;
}
