import { auth } from "@/auth";
import { ManageListingCard } from "@/components/manage/manage-listing-card";
import { ManageSidebar } from "@/components/manage/manage-sidebar";
import { NoListingsMessage } from "@/components/manage/no-listings-message";
import { UnauthenticatedMessage } from "@/components/manage/unauthenticated-message";
import { AwaitedPageProps, DateRangeFilter } from "@/config/types";
import prisma from "@/lib/prisma";
import { ListingStatus } from "@prisma/client";
import { startOfToday, startOfWeek, startOfMonth } from "date-fns";
import { BarChart3, Eye, Calendar, TrendingUp } from "lucide-react";

export default async function ManageListingsPage(props: AwaitedPageProps) {
  const session = await auth();
  if (!session) return <UnauthenticatedMessage />;

  const userId = session?.user?.id;
  const searchParams = await props.searchParams;

  const status = searchParams?.status as ListingStatus | undefined;
  const dateRange = searchParams?.dateRange as DateRangeFilter | undefined;
  const query = searchParams?.q as string | undefined;

  let createdAt: { gte: Date } | undefined;

  if (dateRange === "TODAY") {
    createdAt = { gte: startOfToday() };
  } else if (dateRange === "WEEK") {
    createdAt = { gte: startOfWeek(new Date(), { weekStartsOn: 1 }) }; // Monday start
  } else if (dateRange === "MONTH") {
    createdAt = { gte: startOfMonth(new Date()) };
  }

  const listings = await prisma.listing.findMany({
    where: {
      userId,
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

  // Calculate stats
  const approvedListings = listings.filter(
    (l) => l.status === ListingStatus.APPROVED
  ).length;
  const pendingListings = listings.filter(
    (l) => l.status === ListingStatus.PENDING
  ).length;
  const totalViews = 18; // This should come from your analytics

  if (listings.length === 0 && !status && !dateRange && !query) {
    return <NoListingsMessage />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-muted/20">
      <ManageSidebar searchParams={searchParams} />

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto p-6 max-w-6xl h-full">
          {/* Header Section */}
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Manage Your Listings
                </h1>
                <p className="text-muted-foreground text-lg">
                  View, edit, and track the performance of your property
                  listings
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
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Listings
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
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Your Listings
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
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No listings found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more results
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
                    <ManageListingCard listing={listing} />
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
