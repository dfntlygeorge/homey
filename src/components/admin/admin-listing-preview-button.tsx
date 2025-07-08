"use client";

import { useState } from "react";
import { Eye, Phone, Facebook, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import {
  ListingWithImagesUserAndReports,
  ListingWithAddress,
} from "@/config/types";

interface AdminListingPreviewButtonProps {
  listing: ListingWithImagesUserAndReports & ListingWithAddress;
}

export function AdminListingPreviewButton({
  listing,
}: AdminListingPreviewButtonProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="px-4 transition-colors">
          <Eye className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:flex p-0">Preview</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Listing Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {listing.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {listing.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden border"
                >
                  <Image
                    src={image.url}
                    alt={`${listing.title} - Image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
            <p className="text-2xl font-bold text-green-600 mb-3">
              ₱{listing.rent.toLocaleString()}/month
            </p>
            <p className="text-zinc-600 leading-relaxed">
              {listing.description}
            </p>
          </div>

          <Separator />

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-zinc-900">
                Property Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Type:</span>
                  <span className="font-medium">
                    {getRoomTypeLabel(listing.roomType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Available Slots:</span>
                  <span className="font-medium">{listing.slotsAvailable}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Gender Policy:</span>
                  <span className="font-medium">
                    {getPolicyLabel(listing.genderPolicy)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Curfew:</span>
                  <span className="font-medium">
                    {getPolicyLabel(listing.curfew)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-zinc-900">Amenities</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Kitchen:</span>
                  <span className="font-medium">
                    {getPolicyLabel(listing.kitchen)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Laundry:</span>
                  <span className="font-medium">
                    {getPolicyLabel(listing.laundry)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">WiFi:</span>
                  <span className="font-medium">
                    {getPolicyLabel(listing.wifi)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Utilities:</span>
                  <span className="font-medium">
                    {getPolicyLabel(listing.utilities)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Pets:</span>
                  <span className="font-medium">
                    {getPolicyLabel(listing.pets)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Caretaker:</span>
                  <span className="font-medium">
                    {getPolicyLabel(listing.caretaker)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-3 text-zinc-900">
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                <Phone className="w-4 h-4 text-zinc-500" />
                <span className="font-medium">{listing.contact}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{listing.facebookProfile}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Landlord Info */}
          <div>
            <h4 className="font-semibold mb-3 text-zinc-900">
              Landlord Information
            </h4>
            <div className="space-y-2 text-sm bg-zinc-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-zinc-600">Name:</span>
                <span className="font-medium">{listing.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Email:</span>
                <span className="font-medium">{listing.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">User ID:</span>
                <span className="font-mono text-xs">{listing.user.id}</span>
              </div>
            </div>
          </div>

          {/* Reports Section */}
          {listing.reports && listing.reports.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-zinc-900">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Reports ({listing.reports.length})
                </h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {listing.reports.slice(0, 3).map((report) => (
                    <div
                      key={report.id}
                      className="p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex flex-wrap gap-1">
                          {report.reasons.map((reason, i) => (
                            <Badge
                              key={i}
                              variant="destructive"
                              className="text-xs"
                            >
                              {reason}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                      {report.additionalDetails && (
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                          {report.additionalDetails}
                        </p>
                      )}
                    </div>
                  ))}
                  {listing.reports.length > 3 && (
                    <div className="text-center pt-2">
                      <Link
                        href={`/admin/listings/${listing.id}/reports`}
                        className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        View all {listing.reports.length} reports
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
