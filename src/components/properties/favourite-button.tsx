"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { endpoints } from "@/config/endpoints";

interface FavouriteButtonProps {
  setIsFavourite: (isFavourite: boolean) => void;
  isFavourite: boolean;
  id: number;
}
export const FavouriteButton = (props: FavouriteButtonProps) => {
  const { setIsFavourite, isFavourite, id } = props;

  const router = useRouter();
  // make the api request with this handler
  const handleFavourite = async () => {
    // why did we have to destructure the ids? so kase object is returned from the api with ids as key or property.
    const { ids } = await api.post<{ ids: number[] }>(endpoints.favourites, {
      json: { id }, // send the id to the api endpoint
    });

    // if the ids that are returned from the api enpoint then we set the isFavourite to true
    if (ids.includes(id)) setIsFavourite(true);
    else setIsFavourite(false);
    setTimeout(() => router.refresh(), 250);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "group absolute top-2.5 left-3.5 z-10 !h-8 !w-8 rounded-full transition-colors duration-200 hover:bg-white/90 lg:!h-9 lg:!w-9 xl:!h-10 xl:!w-10 cursor-pointer",
        isFavourite ? "bg-white shadow-sm" : "bg-white/70 backdrop-blur-sm"
      )}
      onClick={handleFavourite}
    >
      <HeartIcon
        className={cn(
          "h-3.5 w-3.5 lg:h-4 lg:w-4 xl:h-6 xl:w-6",
          "transition-colors duration-200 ease-in-out",
          isFavourite
            ? "fill-pink-500 text-pink-500"
            : "text-white group-hover:fill-pink-500 group-hover:text-pink-500"
        )}
      />
    </Button>
  );
};
