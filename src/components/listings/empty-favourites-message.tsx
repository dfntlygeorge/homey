import { routes } from "@/config/routes";
import { FolderHeartIcon } from "lucide-react";
import Link from "next/link";

export const EmptyFavouritesMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
      <FolderHeartIcon className="h-20 w-20 text-gray-300" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold text-gray-900">
        You haven&apos;t saved any listings yet
      </h2>
      <p className="text-gray-600 max-w-md">
        Browse listings and click the heart icon to add your favourites here.
      </p>
      <Link
        href={routes.listings}
        className="mt-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        View Listings
      </Link>
    </div>
  );
};
