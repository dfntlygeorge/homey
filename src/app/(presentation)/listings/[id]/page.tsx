import { PropertyView } from "@/components/listings/property-view";
import { PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function SinglePropertyPage(props: PageProps) {
  const params = await props.params;
  const id = Number(params?.id);

  if (!id) notFound();

  const property = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!property) notFound();
  return <PropertyView {...property} />;
}
