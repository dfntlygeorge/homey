import { PropertyWithImages } from "@/config/types";
import Image from "next/image";
import {
  UtensilsIcon,
  WifiIcon,
  BoltIcon,
  PawPrintIcon,
  UsersIcon,
  ClockIcon,
  WashingMachineIcon,
  CigaretteOffIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Listing } from "@prisma/client";
import { routes } from "@/config/routes";
import { auth } from "@/auth";
import { formatEnumValue } from "@/lib/utils";

const features = (listing: Listing) => [
  {
    id: 1,
    icon: <UsersIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label:
      listing.genderPolicy === "MIXED"
        ? "Mixed Gender"
        : listing.genderPolicy === "MALE_ONLY"
        ? "Male Only"
        : "Female Only",
  },
  {
    id: 2,
    icon: <WashingMachineIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: listing.hasLaundry ? "Laundry Area Available" : "No Laundry Area",
  },
  {
    id: 3,
    icon: <CigaretteOffIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: listing.hasCaretaker ? "With Caretaker" : "No Caretaker",
  },
  {
    id: 4,
    icon: <UtensilsIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: listing.hasKitchen ? "Kitchen Access" : "No Kitchen Access",
  },
  {
    id: 5,
    icon: <WifiIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: listing.hasWifi ? "Wi-Fi Available" : "No Wi-Fi",
  },
  {
    id: 6,
    icon: <BoltIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: listing.includesUtilities
      ? "Utilities Included"
      : "Utilities Not Included",
  },
  {
    id: 7,
    icon: <ClockIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: listing.hasCurfew ? "Has Curfew" : "No Curfew",
  },
  {
    id: 8,
    icon: <PawPrintIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: listing.petsAllowed ? "Pets Allowed" : "No Pets Allowed",
  },
];

export const PropertyView = async (props: PropertyWithImages) => {
  const session = await auth();
  const { images, title, description, location, rent, roomType, id } = props;
  return (
    <div className="relative">
      <div className="container mx-auto flex flex-col md:px-0">
        <div className="flex flex-col md:flex-row">
          {images.length > 0 && (
            <div className="md:w-1/2">
              <Image
                src={images[0].url}
                alt={title}
                width={640}
                height={480}
                className="rounded-lg object-cover"
              />
            </div>
          )}
          <div className="mt-4 md:mt-0 md:w-1/2 md:pl-8">
            <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
            <p className="text-gray-600 mt-2">{location}</p>

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

              <p className="text-center text-sm text-muted-foreground">
                Not sure yet?{" "}
                <Link
                  href="/contact-owner"
                  className="underline font-medium text-primary"
                >
                  Contact the Owner
                </Link>
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
          href="/inventory"
          className="block w-full text-center text-sm font-medium text-primary hover:underline"
        >
          ← Back to Listings
        </Link>
      </div>
    </div>
  );
};
