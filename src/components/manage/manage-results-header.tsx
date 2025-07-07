interface ManageResultsHeaderProps {
  isViewingArchived: boolean;
  listingsCount: number;
  hasFilters: boolean;
}

export function ManageResultsHeader({
  isViewingArchived,
  listingsCount,
  hasFilters,
}: ManageResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-foreground">
          {isViewingArchived ? "Archived Listings" : "Your Listings"}
        </h2>
        {hasFilters && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>•</span>
            <span>Filtered results</span>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {listingsCount} result
        {listingsCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
