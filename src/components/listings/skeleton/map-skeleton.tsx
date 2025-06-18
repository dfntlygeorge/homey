import { Skeleton } from "../../ui/skeleton";

export const MapSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
      <Skeleton className="aspect-[16/9] w-full rounded-md" />
    </div>
  );
};
