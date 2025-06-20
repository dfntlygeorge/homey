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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
          <p className="text-gray-600 mt-2">
            Update your property information and images
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-lg shadow-sm overflow-hidden">
          <ImagesProvider initialImages={listing.images}>
            <ImagePreviewWrapper />
            <EditListingForm listing={listing} />
          </ImagesProvider>
        </div>
      </div>
    </div>
  );
}
