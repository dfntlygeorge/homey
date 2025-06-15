import { ListingCardSkeleton } from "./listing-card-skeleton";

export const ListingsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 8 }, (_, index) => index + 1).map((id) => (
        <ListingCardSkeleton key={id} />
      ))}
    </div>
  );
};
