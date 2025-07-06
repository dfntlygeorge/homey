"use client";

import { Prisma, User, ReservationStatus } from "@prisma/client";
import { Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/config/routes";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  checkReservationStatus,
  reserveListingAction,
  checkOwnerReservationStatus,
  acceptReservationAction,
  declineReservationAction,
} from "@/app/_actions/reserve";

interface ListingChatHeaderProps {
  listing: Prisma.ListingGetPayload<{
    include: {
      images: true;
      address: true;
      user: true;
    };
  }>;
  currentUserId: string;
  otherUser: User;
}

// Helper function to format room type
const formatRoomType = (roomType: string): string => {
  return roomType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const ListingChatHeader = ({
  listing,
  currentUserId,
  otherUser,
}: ListingChatHeaderProps) => {
  const isOwner = listing.userId === currentUserId;
  const firstImage = listing.images?.[0]?.url;

  const [isReserving, setIsReserving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [reservationStatus, setReservationStatus] =
    useState<ReservationStatus | null>(null);
  const [hasPendingReservation, setHasPendingReservation] = useState(false);

  // Check for existing reservation on mount
  useEffect(() => {
    const checkReservation = async () => {
      try {
        if (isOwner) {
          // Check if there's a pending reservation from the other user
          const result = await checkOwnerReservationStatus(
            listing.id,
            currentUserId,
            otherUser.id
          );
          if (result.success && result.reservation) {
            setHasPendingReservation(true);
            setReservationStatus(result.reservation.status);
          }
        } else {
          // Check user's own reservation status
          const result = await checkReservationStatus(
            listing.id,
            currentUserId
          );
          if (result.success && result.reservation) {
            setReservationStatus(result.reservation.status);
          }
        }
      } catch (error) {
        console.error("Error checking reservation:", error);
      }
    };

    checkReservation();
  }, [listing.id, currentUserId, otherUser.id, isOwner]);

  const handleReserveNow = async () => {
    if (isReserving) return;

    setIsReserving(true);

    try {
      const result = await reserveListingAction(listing.id, currentUserId);

      if (result.success) {
        setReservationStatus("PENDING");
        toast.success("Reservation submitted successfully!", {
          description:
            "The owner will be notified of your reservation request.",
        });
      } else {
        toast.error(result.error || "Failed to create reservation");
      }
    } catch (error) {
      console.error("Error reserving listing:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsReserving(false);
    }
  };

  const handleDecline = async () => {
    if (isDeclining) return;

    setIsDeclining(true);

    try {
      const result = await declineReservationAction(
        listing.id,
        currentUserId,
        otherUser.id
      );

      if (result.success) {
        setHasPendingReservation(false);
        setReservationStatus("DECLINED");
        toast.success("Reservation declined", {
          description: "The user has been notified.",
        });
      } else {
        toast.error(result.error || "Failed to decline reservation");
      }
    } catch (error) {
      console.error("Error declining reservation:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeclining(false);
    }
  };

  const handleAccept = async () => {
    if (isAccepting) return;

    setIsAccepting(true);

    try {
      const result = await acceptReservationAction(
        listing.id,
        currentUserId,
        otherUser.id
      );

      if (result.success) {
        setHasPendingReservation(false);
        setReservationStatus("ACCEPTED");
        toast.success("Reservation accepted!", {
          description: "The slot has been reserved and availability updated.",
        });
      } else {
        toast.error(result.error || "Failed to accept reservation");
      }
    } catch (error) {
      console.error("Error accepting reservation:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  const getStatusIndicator = () => {
    if (isOwner && !hasPendingReservation) return null;
    if (!isOwner && !reservationStatus) return null;

    const status = reservationStatus;

    switch (status) {
      case "PENDING":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-md">
            <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-amber-800 truncate">
              {isOwner ? "Pending" : "Pending"}
            </span>
          </div>
        );
      case "ACCEPTED":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-green-800 truncate">
              Accepted
            </span>
          </div>
        );
      case "DECLINED":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-red-50 border border-red-200 rounded-md">
            <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-red-800 truncate">
              Declined
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const getActionButtons = () => {
    if (isOwner) {
      // Owner sees accept/decline buttons only if there's a pending reservation
      if (hasPendingReservation && reservationStatus === "PENDING") {
        return (
          <div className="flex gap-1.5">
            <Button
              onClick={handleDecline}
              disabled={isDeclining}
              size="sm"
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 min-w-0 px-2 sm:px-3"
            >
              {isDeclining ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="hidden sm:inline">Declining...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 flex-shrink-0" />
                  <span className="hidden sm:inline">Decline</span>
                </div>
              )}
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isAccepting}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white min-w-0 px-2 sm:px-3"
            >
              {isAccepting ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="hidden sm:inline">Accepting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 flex-shrink-0" />
                  <span className="hidden sm:inline">Accept</span>
                </div>
              )}
            </Button>
          </div>
        );
      }
      return null;
    } else {
      // Renter sees reserve button based on status
      if (reservationStatus === "PENDING") {
        return null; // Status indicator is shown instead
      }

      if (reservationStatus === "ACCEPTED") {
        return null; // Status indicator is shown instead
      }

      if (reservationStatus === "DECLINED") {
        return (
          <Button
            onClick={handleReserveNow}
            disabled={isReserving || !listing.isAvailable}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-0 px-2 sm:px-3"
          >
            {isReserving ? (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="hidden sm:inline">Reserving...</span>
                <span className="sm:hidden">...</span>
              </div>
            ) : (
              <>
                <span className="hidden sm:inline">Reserve Again</span>
                <span className="sm:hidden">Reserve</span>
              </>
            )}
          </Button>
        );
      }

      // Default state - no reservation
      return (
        <Button
          onClick={handleReserveNow}
          disabled={isReserving || !listing.isAvailable}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 min-w-0 px-2 sm:px-3"
        >
          {isReserving ? (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="hidden sm:inline">Reserving...</span>
              <span className="sm:hidden">...</span>
            </div>
          ) : (
            <>
              <span className="hidden sm:inline">Reserve Now</span>
              <span className="sm:hidden">Reserve</span>
            </>
          )}
        </Button>
      );
    }
  };

  return (
    <div className="bg-white border-b border-zinc-200 p-4 space-y-4">
      {/* Chat Partner Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            {otherUser.name || "Unknown User"}
          </h2>
          <p className="text-sm text-zinc-500">
            {isOwner ? "Interested in your listing" : "Property Owner"}
          </p>
        </div>
      </div>

      {/* Status Indicator */}
      {getStatusIndicator()}

      {/* Listing Info */}
      <div className="flex gap-3 items-start">
        {/* Listing Image */}
        {firstImage && (
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100">
            <Image
              src={firstImage}
              alt={listing.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Listing Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 truncate mb-1">
            {listing.title}
          </h3>

          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-zinc-900">
              ₱{listing.rent.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm text-zinc-500">/ month</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
            <span className="px-2 py-1 bg-zinc-100 rounded-md text-zinc-700 font-medium text-xs">
              {formatRoomType(listing.roomType)}
            </span>

            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-500 flex-shrink-0" />
              <span className="text-zinc-600 whitespace-nowrap">
                {listing.slotsAvailable} available
              </span>
            </div>

            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                listing.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {listing.isAvailable ? (
                <CheckCircle className="w-3 h-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
              )}
              <span className="whitespace-nowrap">
                {listing.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 items-end flex-shrink-0">
          {!isOwner && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 min-w-0 px-2 sm:px-3"
            >
              <Link href={routes.listing(listing.id)}>
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">View</span>
              </Link>
            </Button>
          )}

          {getActionButtons()}
        </div>
      </div>
    </div>
  );
};
