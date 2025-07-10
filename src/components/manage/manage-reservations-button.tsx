"use client";

import { useState } from "react";
import { Calendar, CheckCircle, XCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { Prisma } from "@prisma/client";
import { acceptReservationByIdAction } from "@/app/_actions/manage/accept-reservation";
import { declineReservationByIdAction } from "@/app/_actions/manage/decline-reservation";

interface ManageReservationsButtonProps {
  listing: Prisma.ListingGetPayload<{
    include: {
      images: true;
      reservations: {
        include: {
          user: true;
        };
      };
    };
  }>;
}

export function ManageReservationsButton({
  listing,
}: ManageReservationsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  );
  const reservations = listing.reservations;

  const pendingReservations = reservations.filter(
    (reservation) => reservation.status === "PENDING"
  );

  const handleAccept = async (reservationId: number) => {
    setLoadingStates((prev) => ({ ...prev, [reservationId]: true }));
    try {
      const result = await acceptReservationByIdAction(reservationId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to accept reservation");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [reservationId]: false }));
    }
  };

  const handleDecline = async (reservationId: number) => {
    setLoadingStates((prev) => ({ ...prev, [reservationId]: true }));
    try {
      const result = await declineReservationByIdAction(reservationId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to decline reservation");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [reservationId]: false }));
    }
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="px-3 relative">
          <Calendar className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Reservations</span>
          {pendingReservations.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {pendingReservations.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Manage Reservations — {listing.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {reservations.length} total reservation(s) •{" "}
            {pendingReservations.length} pending
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {reservations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No reservations yet
                </h3>
                <p className="text-muted-foreground text-center">
                  When guests reserve this listing, they will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Reservation #{reservation.id}
                    </CardTitle>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Renter Name</p>
                      <p className="text-sm text-muted-foreground">
                        {reservation.user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Requested on</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(reservation.createdAt)}
                      </p>
                    </div>
                  </div>

                  {reservation.status === "PENDING" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleAccept(reservation.id)}
                        disabled={loadingStates[reservation.id]}
                        className="flex-1"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {loadingStates[reservation.id]
                          ? "Accepting..."
                          : "Accept"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDecline(reservation.id)}
                        disabled={loadingStates[reservation.id]}
                        className="flex-1"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {loadingStates[reservation.id]
                          ? "Declining..."
                          : "Decline"}
                      </Button>
                    </div>
                  )}

                  {reservation.status === "ACCEPTED" &&
                    reservation.acceptedAt && (
                      <div className="text-sm text-green-600">
                        Accepted on {formatDate(reservation.acceptedAt)}
                      </div>
                    )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
