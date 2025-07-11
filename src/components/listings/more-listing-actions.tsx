"use client";

import { Flag, Heart, Copy, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { routes } from "@/config/routes";
import { api } from "@/lib/api-client";
import { endpoints } from "@/config/endpoints";
import { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ListingReportForm } from "./listing-report-form"; // Adjust import path as needed

export const MoreListingActions = ({
  listingId,
  isFavourite,
}: {
  listingId: number;
  isFavourite: boolean;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(isFavourite);

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
        json: { id: listingId },
      });

      if (ids.includes(listingId)) {
        setIsSaved(true);
        toast.success("Listing saved to favourites");
      } else {
        setIsSaved(false);
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

  const handleCopyLink = async () => {
    try {
      // Get the current URL and construct the listing link
      const currentUrl = window.location.origin;
      const listingUrl = `${currentUrl}/listings/${listingId}`; // Adjust this path based on your routing structure

      await navigator.clipboard.writeText(listingUrl);
      toast.success("Link copied to clipboard!");
      setIsDropdownOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement("textarea");
        const currentUrl = window.location.origin;
        const listingUrl = `${currentUrl}/listings/${listingId}`;

        textArea.value = listingUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        toast.success("Link copied to clipboard!");
        setIsDropdownOpen(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (fallbackError) {
        toast.error("Failed to copy link. Please try again.");
      }
    }
  };

  const handleReportClick = () => {
    setIsDropdownOpen(false);
    setIsReportModalOpen(true);
  };

  const handleReportSuccess = () => {
    // You can add any additional logic here when report is successful
    // For example, refresh the page or update some state
    setTimeout(() => router.refresh(), 250);
  };

  return (
    <>
      {/* DROPDOWN TRIGGER BUTTON (3 dots icon) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        {isDropdownOpen && (
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-gray-600 cursor-pointer hover:text-red-600"
              onClick={handleReportClick}
            >
              <Flag className="h-4 w-4 mr-2" />
              Report listing
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-gray-600 cursor-pointer"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`cursor-pointer ${
                isSaved ? "text-red-500" : "text-gray-600"
              }`}
              onClick={handleFavourite}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  isSaved ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {isSaved ? "Saved Listing" : "Save Listing"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      {/* REPORT MODAL */}
      <ListingReportForm
        listingId={listingId}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={handleReportSuccess}
      />
    </>
  );
};
