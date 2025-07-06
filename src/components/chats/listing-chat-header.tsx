"use client";

import { Prisma, User } from "@prisma/client";
import { useReservationStatus } from "@/hooks/useReservationStatus";
import { ChatPartnerInfo } from "./chat-partner-info";
import { ReservationStatusIndicator } from "./reservation-status-indicator";
import { ListingPreview } from "./chat-listing-preview";
import { ReservationActionButtons } from "./reservation-action-buttons";

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

export const ListingChatHeader = ({
  listing,
  currentUserId,
  otherUser,
}: ListingChatHeaderProps) => {
  const isOwner = listing.userId === currentUserId;

  const reservationData = useReservationStatus({
    listingId: listing.id,
    currentUserId,
    otherUserId: otherUser.id,
    isOwner,
  });

  const actionButtons = (
    <ReservationActionButtons
      isOwner={isOwner}
      reservationStatus={reservationData.reservationStatus}
      hasPendingReservation={reservationData.hasPendingReservation}
      isLoadingStatus={reservationData.isLoadingStatus}
      isReserving={reservationData.isReserving}
      isDeclining={reservationData.isDeclining}
      isAccepting={reservationData.isAccepting}
      isAvailable={listing.isAvailable}
      onReserve={reservationData.handleReserveNow}
      onDecline={reservationData.handleDecline}
      onAccept={reservationData.handleAccept}
    />
  );

  return (
    <div className="bg-white border-b border-zinc-200 p-4 space-y-4">
      <ChatPartnerInfo otherUser={otherUser} isOwner={isOwner} />

      <ReservationStatusIndicator
        reservationStatus={reservationData.reservationStatus}
        hasPendingReservation={reservationData.hasPendingReservation}
        isOwner={isOwner}
      />

      <ListingPreview
        listing={listing}
        isOwner={isOwner}
        actionButtons={actionButtons}
      />
    </div>
  );
};
