import { PropertyWithImages } from "@/config/types";
import Image from "next/image";
import {
  HomeIcon,
  ShowerHead,
  UtensilsIcon,
  WifiIcon,
  BoltIcon,
  PawPrintIcon,
  UsersIcon,
  ClockIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const features = () => [
  {
    id: 1,
    icon: <HomeIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: "Single Room",
  },
  {
    id: 2,
    icon: <ShowerHead className="mx-auto h-6 w-6 text-gray-500" />,
    label: "Shared CR",
  },
  {
    id: 3,
    icon: <UtensilsIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: "Kitchen Available",
  },
  {
    id: 4,
    icon: <WifiIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: "Wi-Fi Included",
  },
  {
    id: 5,
    icon: <BoltIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: "Utilities Included",
  },
  {
    id: 6,
    icon: <PawPrintIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: "Pets Allowed",
  },
  {
    id: 7,
    icon: <ClockIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: "Curfew at 10 PM",
  },
  {
    id: 8,
    icon: <UsersIcon className="mx-auto h-6 w-6 text-gray-500" />,
    label: "2 per room",
  },
];
export const PropertyView = (props: PropertyWithImages) => {
  const { images, title, description, location, rent, roomType } = props;
  return (
    <div className="container mx-auto flex flex-col py-12 md:px-0">
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
            {/* TODO: format room type */}
            <p className="my-2">{roomType}</p>
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
            <Button className="w-full font-bold uppercase cursor-pointer">
              Reserve Now
            </Button>
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
              {features().map(({ id, icon, label }) => (
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
  );
};
