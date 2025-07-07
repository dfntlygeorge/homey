import { ListingCardSkeleton } from "./listing-card-skeleton";

export const FavouritesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 6 }, (_, index) => index + 1).map((id) => (
        <ListingCardSkeleton key={id} />
      ))}
    </div>
  );
};
