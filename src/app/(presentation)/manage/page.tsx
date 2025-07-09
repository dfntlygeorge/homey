import { auth } from "@/auth";
import { ManageSidebar } from "@/components/manage/manage-side-enhanced";
import { NoListingsMessage } from "@/components/manage/no-listings-message";
import { UnauthenticatedMessage } from "@/components/manage/unauthenticated-message";
import { ManageHeader } from "@/components/manage/manage-header";
import { ManageViewToggle } from "@/components/manage/manage-view-toggle";
import { ManageResultsSection } from "@/components/manage/manage-results-section";
import { AwaitedPageProps, DateRangeFilter } from "@/config/types";
import prisma from "@/lib/prisma";
import { ListingStatus } from "@prisma/client";
import { startOfToday, startOfWeek, startOfMonth } from "date-fns";
import { ManageDialogFilters } from "@/components/manage/manage-dialog-filter";

export default async function ManageListingsPage(props: AwaitedPageProps) {
  const session = await auth();
  if (!session) return <UnauthenticatedMessage />;

  const userId = session?.user?.id;
  const searchParams = await props.searchParams;

  const status = searchParams?.status as ListingStatus | undefined;
  const dateRange = searchParams?.dateRange as DateRangeFilter | undefined;
  const query = searchParams?.q as string | undefined;
  const view = searchParams?.view as string | undefined;

  // Determine if we're viewing archived listings
  const isViewingArchived = view === "archived";

  // Utility function for date filtering
  let createdAt: { gte: Date } | undefined;

  if (dateRange === "TODAY") {
    createdAt = { gte: startOfToday() };
  } else if (dateRange === "WEEK") {
    createdAt = { gte: startOfWeek(new Date(), { weekStartsOn: 1 }) };
  } else if (dateRange === "MONTH") {
    createdAt = { gte: startOfMonth(new Date()) };
  }

  // Fetch listings based on archive status
  const listings = await prisma.listing.findMany({
    where: {
      userId,
      isArchived: isViewingArchived,
      ...(status && { status }),
      ...(createdAt && { createdAt }),
      ...(query && {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      }),
    },
    include: {
      images: {
        take: 1,
        orderBy: { id: "asc" },
      },
      reservations: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Get counts for both active and archived listings
  const [activeCount, archivedCount] = await Promise.all([
    prisma.listing.count({
      where: {
        userId,
        isArchived: false,
      },
    }),
    prisma.listing.count({
      where: {
        userId,
        isArchived: true,
      },
    }),
  ]);

  // Calculate stats
  const approvedListings = listings.filter(
    (l) => l.status === ListingStatus.APPROVED
  ).length;
  const pendingListings = listings.filter(
    (l) => l.status === ListingStatus.PENDING
  ).length;
  const totalViews = 18; // This should come from your analytics

  const hasFilters = !!(status || dateRange || query);

  // Show no listings message only if no listings exist at all and no filters are applied
  if (
    listings.length === 0 &&
    !hasFilters &&
    !isViewingArchived &&
    activeCount === 0
  ) {
    return <NoListingsMessage hasArchived={archivedCount > 0} />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-muted/20">
      <ManageSidebar
        searchParams={searchParams}
        archivedCount={archivedCount}
      />

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto p-6 max-w-6xl h-full">
          <ManageHeader
            isViewingArchived={isViewingArchived}
            listingsCount={listings.length}
            approvedListings={approvedListings}
            pendingListings={pendingListings}
            totalViews={totalViews}
          />
          <div className="flex justify-between items-center">
            {(activeCount > 0 || archivedCount > 0) && (
              <ManageViewToggle
                activeCount={activeCount}
                archivedCount={archivedCount}
                isViewingArchived={isViewingArchived}
              />
            )}

            <ManageDialogFilters
              searchParams={searchParams}
              archivedCount={archivedCount}
            />
          </div>

          <ManageResultsSection
            listings={listings}
            isViewingArchived={isViewingArchived}
            hasFilters={hasFilters}
          />
        </div>
      </div>
    </div>
  );
}
