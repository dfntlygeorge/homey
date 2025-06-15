import { Skeleton } from "../ui/skeleton";

export const CarouselSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col">
      <Skeleton className="aspect-3/2 w-full" />
      <div className="mt-2 grid grid-cols-4 gap-2">
        <Skeleton className="aspect-3/2" />
        <Skeleton className="aspect-3/2" />
        <Skeleton className="aspect-3/2" />
        <Skeleton className="aspect-3/2" />
      </div>
    </div>
  );
};
