import { Archive, BarChart3 } from "lucide-react";

interface ManageNoResultsProps {
  isViewingArchived: boolean;
  hasFilters: boolean;
}

export function ManageNoResults({
  isViewingArchived,
  hasFilters,
}: ManageNoResultsProps) {
  if (hasFilters) {
    return (
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
    );
  }

  // Empty State for Archived View
  if (isViewingArchived) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Archive className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No archived listings
          </h3>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t archived any listings yet. Archived listings are
            hidden from public view but can be restored anytime.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
