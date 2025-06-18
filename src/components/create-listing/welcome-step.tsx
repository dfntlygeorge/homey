"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  ArrowRightIcon,
  CircleCheckIcon,
  Loader2,
  LockIcon,
  StarIcon,
  Building2Icon,
} from "lucide-react";
import { Button } from "../ui/button";
import { ListingFormStep } from "@/config/types";

export const WelcomeStep = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nextStep = () => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", ListingFormStep.BASIC_INFO.toString());
      router.push(url.toString());
    });
  };

  return (
    <div className="mx-auto rounded-b-lg bg-white shadow-lg md:w-2/3">
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start">
            <CircleCheckIcon className="mr-2 h-6 w-6 text-green-500" />
            <p className="text-gray-700">
              List your property in under 5 minutes
            </p>
          </div>
          <div className="flex items-start">
            <CircleCheckIcon className="mr-2 h-6 w-6 text-green-500" />
            <p className="text-gray-700">
              Reach students looking for verified boarding houses
            </p>
          </div>
        </div>

        <div className="flex items-center justify-around rounded-md bg-gray-100 p-4">
          <div className="text-center">
            <p className="font-bold">Fill Listing Info</p>
            <p className="text-gray-500">Basic info, location, rent</p>
          </div>
          <ArrowRightIcon className="h-6 w-6" />
          <div className="text-center">
            <p className="font-bold">Add Amenities</p>
            <p className="text-gray-500">Kitchen, Wi-Fi, rules, etc.</p>
          </div>
          <ArrowRightIcon className="h-6 w-6" />
          <div className="text-center">
            <p className="font-bold">Upload Images</p>
            <p className="text-gray-500">Show off your space</p>
          </div>
        </div>

        <p className="font-bold">Ready to list your space?</p>

        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center space-y-2">
            <LockIcon className="h-6 w-6" />
            <p className="text-gray-700 text-sm">Secure Posting</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <StarIcon className="h-6 w-6" />
            <p className="text-gray-700 text-sm">Trusted by Students</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Building2Icon className="h-6 w-6" />
            <p className="text-gray-700 text-sm">Verified Listings</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Button
          type="button"
          onClick={nextStep}
          disabled={isPending}
          className="flex w-full gap-x-3 font-bold uppercase cursor-pointer"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          I&apos;m Ready
        </Button>
      </div>
    </div>
  );
};
