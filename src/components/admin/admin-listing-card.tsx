"use client";

import {
  Eye,
  Check,
  X,
  MoreHorizontal,
  User,
  Calendar,
  MapPin,
  Phone,
  Facebook,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { ListingWithImagesAndUser } from "@/config/types";
import { useState } from "react";
import { toast } from "sonner";
import { updateListingStatus } from "@/app/_actions/update-listing-status";
import { ListingStatus, NotificationType } from "@prisma/client";
import { createNotificationAction } from "@/app/_actions/notification";

interface AdminListingCardProps {
  listing: ListingWithImagesAndUser;
}

export function AdminListingCard({ listing }: AdminListingCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-zinc-100 text-zinc-800";
    }
  };

  const getRoomTypeLabel = (roomType: string) => {
    return roomType
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getPolicyLabel = (policy: string) => {
    return policy
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleApprove = async () => {
    setIsPending(true);
    try {
      // TODO: Implement approve listing action
      await updateListingStatus(listing.id, ListingStatus.APPROVED);
      await createNotificationAction(
        listing.user.id,
        `Your listing '${listing.title} has been approved.`,
        NotificationType.LISTING,
        listing.id
      );
      toast.success("Listing approved successfully");
    } catch (error) {
      console.error("Error in approving the listing: ", error);
      toast.error("Failed to approve listing");
    } finally {
      setIsPending(false);
    }
  };

  const handleReject = async () => {
    setIsPending(true);
    try {
      // TODO: Implement reject listing action
      await updateListingStatus(listing.id, ListingStatus.REJECTED);
      await createNotificationAction(
        listing.user.id,
        `Your listing '${listing.title} has been rejected.`,
        NotificationType.LISTING,
        listing.id
      );
      toast.success("Listing rejected");
    } catch (error) {
      console.error("Error in rejecting the listing: ", error);
      toast.error("Failed to reject listing");
    } finally {
      setIsPending(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Top Section: Image, Details, and Status */}
        <div className="flex gap-4 mb-4">
          {/* Image Section */}
          <div className="relative w-24 h-24 bg-zinc-200 flex-shrink-0 rounded-lg overflow-hidden">
            {listing.images[0] ? (
              <Image
                src={listing.images[0].url}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                <Eye className="w-8 h-8 opacity-50" />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-zinc-900 truncate mb-1">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {getRoomTypeLabel(listing.roomType)}
                  </Badge>
                  <span className="text-sm text-zinc-500">•</span>
                  <span className="text-sm text-zinc-500 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {listing.slotsAvailable} slots
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <Badge className={getStatusColor(listing.status)}>
                {listing.status}
              </Badge>
            </div>

            <p className="text-xl font-bold text-zinc-900 mb-2">
              ₱{listing.rent.toLocaleString()}/month
            </p>

            {/* User and Date Info */}
            <div className="space-y-1 text-sm text-zinc-600 hidden sm:block">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>{listing.user.name}</span>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-500">{listing.user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>Submitted {formatDate(listing.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{listing.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}

        <div className="flex gap-2">
          {listing.status === "PENDING" && (
            <>
              <Button
                onClick={handleApprove}
                disabled={isPending}
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 sm:flex hidden"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={handleReject}
                disabled={isPending}
                variant="destructive"
                size="sm"
                className="flex-1 sm:flex hidden"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}

          <div className="flex gap-2 sm:ml-auto sm:order-none order-1 w-full sm:w-auto justify-end">
            {/* Preview Button */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="px-4">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Listing Preview</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Images */}
                  {listing.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {listing.images.slice(0, 4).map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden"
                        >
                          <Image
                            src={image.url}
                            alt={`${listing.title} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {listing.title}
                    </h3>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ₱{listing.rent.toLocaleString()}/month
                    </p>
                    <p className="text-zinc-600 mb-4">{listing.description}</p>
                  </div>

                  <Separator />

                  {/* Property Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Property Details</h4>
                      <div className="space-y-1 text-sm">
                        <div>Type: {getRoomTypeLabel(listing.roomType)}</div>
                        <div>Available Slots: {listing.slotsAvailable}</div>
                        <div>
                          Gender Policy: {getPolicyLabel(listing.genderPolicy)}
                        </div>
                        <div>Curfew: {getPolicyLabel(listing.curfew)}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Amenities</h4>
                      <div className="space-y-1 text-sm">
                        <div>Kitchen: {getPolicyLabel(listing.kitchen)}</div>
                        <div>Laundry: {getPolicyLabel(listing.laundry)}</div>
                        <div>WiFi: {getPolicyLabel(listing.wifi)}</div>
                        <div>
                          Utilities: {getPolicyLabel(listing.utilities)}
                        </div>
                        <div>Pets: {getPolicyLabel(listing.pets)}</div>
                        <div>
                          Caretaker: {getPolicyLabel(listing.caretaker)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Info */}
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{listing.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Facebook className="w-4 h-4" />
                        <span>{listing.facebookProfile}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Landlord Info */}
                  <div>
                    <h4 className="font-medium mb-2">Landlord Information</h4>
                    <div className="space-y-1 text-sm">
                      <div>Name: {listing.user.name}</div>
                      <div>Email: {listing.user.email}</div>
                      <div>User ID: {listing.user.id}</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-2">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={`/listings/${listing.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Listing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${listing.user.id}`}>
                    <User className="w-4 h-4 mr-2" />
                    View Landlord Profile
                  </Link>
                </DropdownMenuItem>
                {listing.status !== "PENDING" && (
                  <DropdownMenuItem
                    onClick={async () => {
                      await updateListingStatus(
                        listing.id,
                        ListingStatus.PENDING
                      );
                      await createNotificationAction(
                        listing.user.id,
                        `Your listing '${listing.title} has been mark as pending.`,
                        NotificationType.LISTING,
                        listing.id
                      );
                      toast.success("Status reset to pending");
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reset to Pending
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
