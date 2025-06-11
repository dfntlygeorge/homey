import { PropertyWithImages } from "@/config/types";
import {
  UtensilsIcon,
  WifiIcon,
  BoltIcon,
  PawPrintIcon,
  UsersIcon,
  ClockIcon,
  WashingMachineIcon,
  UserCheckIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Listing } from "@prisma/client";
import { routes } from "@/config/routes";
import { auth } from "@/auth";
import { cn, formatEnumValue } from "@/lib/utils";
import { ListingCarousel } from "./listing-carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const features = (listing: Listing) => [
  {
    id: 1,
    icon: (
      <UsersIcon
        className={cn(
          "h-6 w-6",
          listing.genderPolicy === "MIXED"
            ? "text-blue-500"
            : listing.genderPolicy === "MALE_ONLY"
            ? "text-cyan-600"
            : "text-pink-500"
        )}
      />
    ),
    label:
      listing.genderPolicy === "MIXED"
        ? "Mixed Gender"
        : listing.genderPolicy === "MALE_ONLY"
        ? "Male Only"
        : "Female Only",
  },
  {
    id: 2,
    icon: (
      <WashingMachineIcon
        className={cn(
          "h-6 w-6",
          listing.laundry === "AVAILABLE" ? "text-green-600" : "text-gray-400"
        )}
      />
    ),
    label:
      listing.laundry === "AVAILABLE"
        ? "Laundry Area Available"
        : "No Laundry Area",
  },
  {
    id: 3,
    icon: (
      <UserCheckIcon
        className={cn(
          "h-6 w-6",
          listing.caretaker === "AVAILABLE"
            ? "text-purple-600"
            : "text-gray-400"
        )}
      />
    ),
    label:
      listing.caretaker === "AVAILABLE" ? "With Caretaker" : "No Caretaker",
  },
  {
    id: 4,
    icon: (
      <UtensilsIcon
        className={cn(
          "h-6 w-6",
          listing.kitchen === "AVAILABLE" ? "text-yellow-600" : "text-gray-400"
        )}
      />
    ),
    label:
      listing.kitchen === "AVAILABLE" ? "Kitchen Access" : "No Kitchen Access",
  },
  {
    id: 5,
    icon: (
      <WifiIcon
        className={cn(
          "h-6 w-6",
          listing.wifi === "AVAILABLE" ? "text-indigo-600" : "text-gray-400"
        )}
      />
    ),
    label: listing.wifi === "AVAILABLE" ? "Wi-Fi Available" : "No Wi-Fi",
  },
  {
    id: 6,
    icon: (
      <BoltIcon
        className={cn(
          "h-6 w-6",
          listing.utilities === "INCLUDED" ? "text-emerald-600" : "text-red-400"
        )}
      />
    ),
    label:
      listing.utilities === "INCLUDED"
        ? "Utilities Included"
        : "Utilities Not Included",
  },
  {
    id: 7,
    icon: (
      <ClockIcon
        className={cn(
          "h-6 w-6",
          listing.curfew === "HAS_CURFEW" ? "text-orange-600" : "text-gray-400"
        )}
      />
    ),
    label: listing.curfew === "HAS_CURFEW" ? "Has Curfew" : "No Curfew",
  },
  {
    id: 8,
    icon: (
      <PawPrintIcon
        className={cn(
          "h-6 w-6",
          listing.pets === "ALLOWED" ? "text-pink-500" : "text-gray-400"
        )}
      />
    ),
    label: listing.pets === "ALLOWED" ? "Pets Allowed" : "No Pets Allowed",
  },
];

export const PropertyView = async (props: PropertyWithImages) => {
  const session = await auth();
  const {
    images,
    title,
    description,
    address,
    rent,
    roomType,
    id,
    facebookProfile,
    contactInfo,
  } = props;
  return (
    <div className="relative">
      <div className="container mx-auto flex flex-col md:px-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <ListingCarousel images={images} />
          </div>
          <div className="mt-4 md:mt-0 md:w-1/2 md:pl-8">
            <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
            <p className="text-gray-600 mt-2">{address}</p>

            <div className="my-4">
              <p className="text-lg font-semibold">₱{rent}</p>
              <p className="my-2">{formatEnumValue(roomType)}</p>
            </div>
            {description && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-gray-700 mt-1 whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}
            {/* CTAs go here */}
            <div className="mt-6 space-y-3">
              <Link href={routes.reserve(id)}>
                <Button
                  className="w-full font-bold uppercase cursor-pointer"
                  title={!session ? "You need to sign in to reserve" : ""}
                >
                  Reserve Now
                </Button>
              </Link>

              <p className="text-center text-sm text-muted-foreground ">
                Not sure yet?{" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        href={facebookProfile ?? ""}
                        className="underline text-black"
                      >
                        Contact Owner
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      {facebookProfile ? (
                        <p>
                          You&apos;ll be redirected to the owner&apos;s Facebook
                          profile
                        </p>
                      ) : (
                        <p>
                          Contact number: {contactInfo}{" "}
                          {facebookProfile ?? "tite"}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
            </div>

            {/* Features section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Deets</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {features(props).map(({ id, icon, label }) => (
                  <div
                    key={id}
                    className="flex flex-col items-center rounded-lg bg-gray-100 p-4 text-center shadow-sm"
                  >
                    {icon}
                    <p className="mt-2 text-sm font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white p-4 shadow-md">
        <Link
          href={routes.listings}
          className="block w-full text-center text-sm font-medium text-primary hover:underline"
        >
          ← Back to Listings
        </Link>
      </div>
    </div>
  );
};
