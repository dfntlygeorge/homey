import { ListingStatus } from "@prisma/client";

export function StatusTag({ status }: { status: ListingStatus }) {
  const color =
    status === "APPROVED"
      ? "bg-green-100 text-green-700"
      : status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";

  const label =
    status === "APPROVED"
      ? "Approved"
      : status === "REJECTED"
      ? "Rejected"
      : "Pending";

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${color}`}>
      {label}
    </span>
  );
}
