import { Skeleton } from "../ui/skeleton";

export const ListingDetailsSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
      {/* Property Header */}
      <div className="border-b border-gray-100 pb-6 mb-6">
        <Skeleton className="h-8 lg:h-10 w-3/4 mb-3" />
        <div className="flex items-center mb-4">
          <Skeleton className="h-4 w-4 rounded-sm mr-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Price and Room Type */}
        <div className="flex items-baseline gap-3 mb-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Description */}
      <div className="border-b border-gray-100 pb-6 mb-6">
        <Skeleton className="h-6 w-40 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-b border-gray-100 pb-6 mb-6 space-y-4">
        <Skeleton className="h-12 w-full rounded-md" />

        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-24 mx-auto" />
          <Skeleton className="h-8 w-32 mx-auto rounded-lg" />
        </div>
      </div>

      {/* Features Section */}
      <div>
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
            >
              <Skeleton className="h-6 w-6 rounded-sm flex-shrink-0" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
