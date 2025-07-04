import { ListingView } from "@/components/listings/listing-view";
import { PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ListingPage(props: PageProps) {
  const params = await props.params;
  const id = Number(params?.id);

  if (!id) notFound();

  const listing = await prisma.listing.findUnique({
    where: { id },
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
    },
  });

  if (!listing) notFound();
  return <ListingView {...listing} />;
}
