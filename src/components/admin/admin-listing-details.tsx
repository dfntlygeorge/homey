"use client";

import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle } from "lucide-react";
import {
  ListingWithImagesUserAndReports,
  ListingWithAddress,
} from "@/config/types";

interface AdminListingDetailsProps {
  listing: ListingWithImagesUserAndReports & ListingWithAddress;
}

export function AdminListingDetails({ listing }: AdminListingDetailsProps) {
  const getRoomTypeLabel = (roomType: string) => {
    return roomType
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getReportSeverity = (reportsCount: number) => {
    if (reportsCount >= 5) return "high";
    if (reportsCount >= 3) return "medium";
    if (reportsCount >= 1) return "low";
    return "none";
  };

  const getReportColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-zinc-100 text-zinc-800 border-zinc-200";
    }
  };

  return (
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-zinc-900 truncate mb-2">
          {listing.title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs font-medium">
            {getRoomTypeLabel(listing.roomType)}
          </Badge>
          <span className="text-sm text-zinc-400">•</span>
          <span className="text-sm text-zinc-600 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {listing.slotsAvailable} slots
          </span>

          {listing.reports && listing.reports.length > 0 && (
            <>
              <span className="text-sm text-zinc-400">•</span>
              <Badge
                variant="outline"
                className={`text-xs border font-medium ${getReportColor(
                  getReportSeverity(listing.reports.length)
                )}`}
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                {listing.reports.length} report
                {listing.reports.length !== 1 ? "s" : ""}
              </Badge>
            </>
          )}
        </div>
        <p className="text-xl font-bold text-zinc-900">
          ₱{listing.rent.toLocaleString()}/month
        </p>
      </div>

      <Badge className={`${getStatusColor(listing.status)} border font-medium`}>
        {listing.status}
      </Badge>
    </div>
  );
}
