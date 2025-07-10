import { auth } from "@/auth";
import { CreateListingForm } from "@/components/create-listing/create-listing-form";
import { CreateListingUnauthenticated } from "@/components/create-listing/unauthenticated-message";
import { ImagePreviewWrapper } from "@/components/edit-listing/image-preview-wrapper";
import { ImagesProvider } from "@/context/edit-listing/images-context";

export default async function CreateListingPage() {
  const session = await auth();

  if (!session) return <CreateListingUnauthenticated />;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Listing</h1>
          <p className="text-gray-600 mt-2">
            Create your property information and images
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-lg shadow-sm overflow-hidden">
          <ImagesProvider>
            <ImagePreviewWrapper />
            <CreateListingForm />
          </ImagesProvider>
        </div>
      </div>
    </div>
  );
}
