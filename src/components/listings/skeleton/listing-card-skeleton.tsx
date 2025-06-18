import { Skeleton } from "../../ui/skeleton";

export const ListingCardSkeleton = () => {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg bg-background shadow-md border border-border group h-full">
      {/* Image area with aspect ratio */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Skeleton className="w-full h-full rounded-t-md" />

        {/* Distance badge skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Favorite button skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 space-y-3">
        {/* Title and Description */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-1">
          {/* Location */}
          <div className="flex items-start gap-2">
            <Skeleton className="h-4 w-4 rounded-sm flex-shrink-0 mt-0.5" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Property Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1.5">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-12" />
            </div>

            <div className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1.5">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="flex items-center gap-2 bg-muted/50 rounded-md px-2 py-1.5">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-1 flex flex-col sm:flex-row gap-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
        </div>
      </div>
    </div>
  );
};
