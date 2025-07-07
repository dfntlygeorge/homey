import { Archive, BarChart3, Eye, Calendar, TrendingUp } from "lucide-react";

interface ManageHeaderProps {
  isViewingArchived: boolean;
  listingsCount: number;
  approvedListings: number;
  pendingListings: number;
  totalViews: number;
}

export const ManageHeader = ({
  isViewingArchived,
  listingsCount,
  approvedListings,
  pendingListings,
  totalViews,
}: ManageHeaderProps) => {
  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {isViewingArchived ? "Archived Listings" : "Manage Your Listings"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isViewingArchived
              ? "View and manage your archived property listings"
              : "View, edit, and track the performance of your property listings"}
          </p>
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
                {listingsCount}
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
              <p className="text-2xl font-bold text-foreground">{totalViews}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
