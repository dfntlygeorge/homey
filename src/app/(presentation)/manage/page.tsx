import { auth } from "@/auth";
import { ManageListingCard } from "@/components/manage/manage-listing-card";
import { ManageSidebar } from "@/components/manage/manage-side-enhanced";
import { NoListingsMessage } from "@/components/manage/no-listings-message";
import { UnauthenticatedMessage } from "@/components/manage/unauthenticated-message";
import { AwaitedPageProps, DateRangeFilter } from "@/config/types";
import prisma from "@/lib/prisma";
import { ListingStatus } from "@prisma/client";
import { startOfToday, startOfWeek, startOfMonth } from "date-fns";
import {
  BarChart3,
  Eye,
  Calendar,
  TrendingUp,
  Archive,
  FolderOpen,
} from "lucide-react";

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

  let createdAt: { gte: Date } | undefined;

  if (dateRange === "TODAY") {
    createdAt = { gte: startOfToday() };
  } else if (dateRange === "WEEK") {
    createdAt = { gte: startOfWeek(new Date(), { weekStartsOn: 1 }) }; // Monday start
  } else if (dateRange === "MONTH") {
    createdAt = { gte: startOfMonth(new Date()) };
  }

  // Fetch listings based on archive status
  const listings = await prisma.listing.findMany({
    where: {
      userId,
      isArchived: isViewingArchived, // Filter by archive status
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

  // Calculate stats based on current view
  const approvedListings = listings.filter(
    (l) => l.status === ListingStatus.APPROVED
  ).length;
  const pendingListings = listings.filter(
    (l) => l.status === ListingStatus.PENDING
  ).length;
  const totalViews = 18; // This should come from your analytics

  // Show no listings message only if no listings exist at all and no filters are applied
  if (
    listings.length === 0 &&
    !status &&
    !dateRange &&
    !query &&
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
          {/* Header Section */}
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {isViewingArchived
                    ? "Archived Listings"
                    : "Manage Your Listings"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {isViewingArchived
                    ? "View and manage your archived property listings"
                    : "View, edit, and track the performance of your property listings"}
                </p>
              </div>

              {/* Quick Actions - if you have them */}
              <div className="hidden md:flex items-center gap-3">
                {/* Add create listing button or other actions here */}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    {isViewingArchived ? (
                      <Archive className="h-5 w-5 text-blue-500" />
                    ) : (
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {isViewingArchived ? "Archived" : "Total"} Listings
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {listings.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold text-foreground">
                      {approvedListings}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-foreground">
                      {pendingListings}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Eye className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalViews}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* View Toggle Pills - Only show if user has both active and archived listings */}
            {(activeCount > 0 || archivedCount > 0) && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      !isViewingArchived
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    disabled={!isViewingArchived}
                  >
                    <FolderOpen className="h-4 w-4" />
                    Active ({activeCount})
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isViewingArchived
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    disabled={isViewingArchived}
                  >
                    <Archive className="h-4 w-4" />
                    Archived ({archivedCount})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {isViewingArchived ? "Archived Listings" : "Your Listings"}
                </h2>
                {(status || dateRange || query) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>•</span>
                    <span>Filtered results</span>
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {listings.length} result
                {listings.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* No Results Message */}
            {listings.length === 0 && (status || dateRange || query) && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    {isViewingArchived ? (
                      <Archive className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No {isViewingArchived ? "archived " : ""}listings found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              </div>
            )}

            {/* Empty State for Archived View */}
            {listings.length === 0 &&
              isViewingArchived &&
              !status &&
              !dateRange &&
              !query && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <Archive className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No archived listings
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You haven&apos;t archived any listings yet. Archived
                      listings are hidden from public view but can be restored
                      anytime.
                    </p>
                  </div>
                </div>
              )}

            {/* Listings Grid */}
            {listings.length > 0 && (
              <div className="space-y-4">
                {listings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ManageListingCard
                      listing={listing}
                      isArchived={isViewingArchived}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Load More / Pagination could go here if needed */}
        </div>
      </div>
    </div>
  );
}
