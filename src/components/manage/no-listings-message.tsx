import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { ListingFormStep } from "@/config/types";

export function NoListingsMessage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <p className="text-lg text-gray-600 mb-4">
        You don&apos;t have any listings under this account
      </p>
      <Link href={routes.createListing(ListingFormStep.WELCOME)}>
        <Button variant="default">Create Your First Listing</Button>
      </Link>
    </div>
  );
}
