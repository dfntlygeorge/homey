import { useState, useEffect } from "react";
import { ReservationStatus } from "@prisma/client";
import { toast } from "sonner";
import { reserveListingAction } from "@/app/_actions/chats/reserve-listing";
import { declineReservationAction } from "@/app/_actions/chats/decline-reservation";
import { acceptReservationAction } from "@/app/_actions/chats/accept-reservation";
import { checkOwnerReservationStatus } from "@/app/_actions/chats/check-owner-reservation-status";
import { checkReservationStatus } from "@/app/_actions/chats/check-reservation-status";

interface UseReservationStatusProps {
  listingId: number;
  currentUserId: string;
  otherUserId: string;
  isOwner: boolean;
}

export const useReservationStatus = ({
  listingId,
  currentUserId,
  otherUserId,
  isOwner,
}: UseReservationStatusProps) => {
  const [isReserving, setIsReserving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [reservationStatus, setReservationStatus] =
    useState<ReservationStatus | null>(null);
  const [hasPendingReservation, setHasPendingReservation] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Check for existing reservation on mount
  useEffect(() => {
    const checkReservation = async () => {
      try {
        setIsLoadingStatus(true);
        if (isOwner) {
          const result = await checkOwnerReservationStatus(
            listingId,
            currentUserId,
            otherUserId
          );
          if (result.success && result.reservation) {
            setHasPendingReservation(true);
            setReservationStatus(result.reservation.status);
          }
        } else {
          const result = await checkReservationStatus(listingId, currentUserId);
          if (result.success && result.reservation) {
            setReservationStatus(result.reservation.status);
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Error checking reservation");
      } finally {
        setIsLoadingStatus(false);
      }
    };

    checkReservation();
  }, [listingId, currentUserId, otherUserId, isOwner]);

  const handleReserveNow = async () => {
    if (isReserving) return;

    setIsReserving(true);

    try {
      const result = await reserveListingAction(listingId);

      if (result.success) {
        setReservationStatus("PENDING");
        toast.success("Reservation submitted successfully!", {
          description:
            "The owner will be notified of your reservation request.",
        });
      } else {
        toast.error(result.error || "Failed to create reservation");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
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
        listingId,
        currentUserId,
        otherUserId
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
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
        listingId,
        currentUserId,
        otherUserId
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  return {
    reservationStatus,
    hasPendingReservation,
    isLoadingStatus,
    isReserving,
    isDeclining,
    isAccepting,
    handleReserveNow,
    handleDecline,
    handleAccept,
  };
};
