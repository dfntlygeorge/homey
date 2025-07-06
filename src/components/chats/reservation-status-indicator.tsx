import { ReservationStatus } from "@prisma/client";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface ReservationStatusIndicatorProps {
  reservationStatus: ReservationStatus | null;
  hasPendingReservation: boolean;
  isOwner: boolean;
}

export const ReservationStatusIndicator = ({
  reservationStatus,
  hasPendingReservation,
  isOwner,
}: ReservationStatusIndicatorProps) => {
  if (isOwner && !hasPendingReservation) return null;
  if (!isOwner && !reservationStatus) return null;

  const status = reservationStatus;

  switch (status) {
    case "PENDING":
      return (
        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-md">
          <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-amber-800 truncate">
            Pending
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
