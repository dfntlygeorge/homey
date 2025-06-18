import { ListingCardSkeleton } from "./listing-card-skeleton";

export const FavouritesSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 6 }, (_, index) => index + 1).map((id) => (
        <ListingCardSkeleton key={id} />
      ))}
    </div>
  );
};
