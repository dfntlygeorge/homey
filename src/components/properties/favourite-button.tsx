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

  const handleFavourite = async () => {
    try {
      const { ids } = await api.post<{ ids: number[] }>(endpoints.favourites, {
        json: { id },
      });

      if (ids.includes(id)) setIsFavourite(true);
      else setIsFavourite(false);

      setTimeout(() => router.refresh(), 250);
    } catch (error) {
      console.error("Failed to update favourite:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute top-3 left-3 z-20 h-8 w-8 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer",
        "shadow-lg backdrop-blur-sm",
        isFavourite
          ? "bg-white/95 hover:bg-white"
          : "bg-white/80 hover:bg-white/95"
      )}
      onClick={handleFavourite}
    >
      <HeartIcon
        className={cn(
          "h-4 w-4 transition-all duration-200 ease-in-out",
          isFavourite
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-600 hover:text-red-500 hover:fill-red-500"
        )}
      />
    </Button>
  );
};
