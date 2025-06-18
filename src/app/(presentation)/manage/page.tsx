import { auth } from "@/auth";
import { ManageListingCard } from "@/components/manage/manage-listing-card";
import { NoListingsMessage } from "@/components/manage/no-listings-message";
import { UnauthenticatedMessage } from "@/components/manage/unauthenticated-message";
import prisma from "@/lib/prisma";

export default async function ManageListingsPage() {
  const session = await auth();
  if (!session) return <UnauthenticatedMessage />;

  const userId = session?.user?.id;

  const listings = await prisma.listing.findMany({
    where: { userId },
    include: {
      images: {
        take: 1,
        orderBy: { id: "asc" },
      },
    },
  });

  if (listings.length === 0) return <NoListingsMessage />;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Manage Your Listings
        </h1>
        <p className="text-zinc-600">View and manage all your listings</p>
      </div>

      {/* Single column layout for horizontal cards */}
      <div className="space-y-4">
        {listings.map((listing) => (
          <ManageListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
