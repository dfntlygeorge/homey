import { ReservationStatus } from "@prisma/client";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ReservationActionButtonsProps {
  isOwner: boolean;
  reservationStatus: ReservationStatus | null;
  hasPendingReservation: boolean;
  isReserving: boolean;
  isDeclining: boolean;
  isAccepting: boolean;
  isAvailable: boolean;
  onReserve: () => void;
  onDecline: () => void;
  onAccept: () => void;
}

export const ReservationActionButtons = ({
  isOwner,
  reservationStatus,
  hasPendingReservation,
  isReserving,
  isDeclining,
  isAccepting,
  isAvailable,
  onReserve,
  onDecline,
  onAccept,
}: ReservationActionButtonsProps) => {
  if (isOwner) {
    // Owner sees accept/decline buttons only if there's a pending reservation
    if (hasPendingReservation && reservationStatus === "PENDING") {
      return (
        <div className="flex gap-1.5">
          <Button
            onClick={onDecline}
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
            onClick={onAccept}
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
    if (reservationStatus === "PENDING" || reservationStatus === "ACCEPTED") {
      return null; // Status indicator is shown instead
    }

    const isDeclined = reservationStatus === "DECLINED";
    const buttonText = isDeclined ? "Reserve Again" : "Reserve Now";
    const buttonTextShort = "Reserve";

    return (
      <Button
        onClick={onReserve}
        disabled={isReserving || !isAvailable}
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
            <span className="hidden sm:inline">{buttonText}</span>
            <span className="sm:hidden">{buttonTextShort}</span>
          </>
        )}
      </Button>
    );
  }
};
