"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { endpoints } from "@/config/endpoints";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { routes } from "@/config/routes";
import { HTTPError } from "ky";

interface FavouriteButtonProps {
  setIsFavourite: (isFavourite: boolean) => void;
  isFavourite: boolean;
  id: number;
}

export const FavouriteButton = (props: FavouriteButtonProps) => {
  const { setIsFavourite, isFavourite, id } = props;

  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const handleFavourite = async () => {
    // Check authentication before proceeding
    if (!isAuthenticated) {
      toast.info("Please sign in to save listings", {
        action: {
          label: "Sign In",
          onClick: () => router.push(routes.signIn), // Adjust to your sign-in route
        },
      });
      return;
    }

    try {
      const { ids } = await api.post<{
        ids: number[];
      }>(endpoints.favourites, {
        json: { id },
      });

      if (ids.includes(id)) {
        setIsFavourite(true);
        toast.success("Listing saved to favourites");
      } else {
        setIsFavourite(false);
        toast.success("Listing removed from favourites");
      }

      setTimeout(() => router.refresh(), 250);
    } catch (error) {
      if (error instanceof HTTPError) {
        if (error.response.status === 401) {
          toast.info("Please sign in to save listings");
          return;
        } else if (error.response.status === 429) {
          toast.error("Slow down kid.");
          return;
        } else {
          toast.error("Failed to update favourite. Please try again.");
          return;
        }
      }

      // This will only run if it's not an HTTPError
      toast.error("Failed to update favourite. Please try again.");
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
