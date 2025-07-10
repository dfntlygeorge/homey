import { EditListingForm } from "@/components/edit-listing/edit-listing-form";
import { ImagePreviewWrapper } from "@/components/edit-listing/image-preview-wrapper";
import { AwaitedPageProps } from "@/config/types";
import { ImagesProvider } from "@/context/edit-listing/images-context";
import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // Adjust import path as needed
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { Lock, ChevronRight } from "lucide-react";

export default async function EditListingPage(props: AwaitedPageProps) {
  const session = await auth();

  // Check if user is authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to edit property listings.
          </p>
          <Link href={routes.signIn}>
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium group">
              Sign In to Continue
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const params = await props.params;
  const listingId = Number(params?.id);
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      images: true,
      address: true,
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
