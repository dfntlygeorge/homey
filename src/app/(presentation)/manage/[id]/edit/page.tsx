import { EditListingForm } from "@/components/edit-listing/edit-listing-form";
import { ImagePreviewWrapper } from "@/components/edit-listing/image-preview-wrapper";
import { AwaitedPageProps } from "@/config/types";
import { ImagesProvider } from "@/context/edit-listing/images-context";
import prisma from "@/lib/prisma";

export default async function EditListingPage(props: AwaitedPageProps) {
  const params = await props.params;
  const listingId = Number(params?.id);
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      images: true,
    },
  });

  if (!listing) return <div>No listing found</div>;

  return (
    <div className="flex">
      <ImagesProvider initialImages={listing.images}>
        <ImagePreviewWrapper />
        <EditListingForm listing={listing} />
      </ImagesProvider>
    </div>
  );
}
