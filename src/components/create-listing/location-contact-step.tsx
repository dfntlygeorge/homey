"use client";

import { routes } from "@/config/routes";
import { AwaitedPageProps, ListingFormStep } from "@/config/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import {
  LocationContactSchema,
  LocationContactType,
} from "@/app/_schemas/form.schema";
import { LocationPicker } from "./location-picker";
import { Label } from "../ui/label";
import { AddressAutocomplete } from "./address-autocomplete";
import { ListingMinimap } from "../shared/minimap";
import { generateSessionToken } from "@/lib/utils";
import {
  SearchBoxSuggestion,
  LocationDetails,
} from "@/config/types/autocomplete-address.type";

export const LocationContactStep = (props: AwaitedPageProps) => {
  const { searchParams } = props;

  const form = useForm<LocationContactType>({
    resolver: zodResolver(LocationContactSchema),
    mode: "onBlur",
    defaultValues: {
      address: "",
      contact: "",
      facebookProfile: "",
      longitude: undefined,
      latitude: undefined,
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  // Callback to handle address changes from LocationPicker
  const handleAddressChange = useCallback(
    ({ address, longitude, latitude }: LocationDetails) => {
      form.setValue("address", address, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("longitude", longitude);
      form.setValue("latitude", latitude);
    },
    [form]
  );

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", ListingFormStep.BASIC_INFO.toString());
      router.push(url.toString());
    });
  };

  const onNextStep: SubmitHandler<LocationContactType> = (data) => {
    startTransition(async () => {
      const valid = await form.trigger();
      if (!valid) return;

      await new Promise((resolve) => setTimeout(resolve, 500)); // Optional for loading effect

      const url = new URL(
        routes.createListing(ListingFormStep.HOUSE_RULES),
        process.env.NEXT_PUBLIC_APP_URL
      );

      if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) url.searchParams.set(key, value as string);
        });
      }

      url.searchParams.set("step", ListingFormStep.HOUSE_RULES.toString()); // Next step

      url.searchParams.set("address", encodeURIComponent(data.address));
      url.searchParams.set("longitude", encodeURIComponent(data.longitude));
      url.searchParams.set("latitude", encodeURIComponent(data.latitude));
      url.searchParams.set("contact", encodeURIComponent(data.contact));
      url.searchParams.set(
        "facebookProfile",
        encodeURIComponent(data.facebookProfile)
      );

      router.push(url.toString());
    });
  };

  const handleAddressSelect = useCallback(
    async (suggestion: SearchBoxSuggestion) => {
      try {
        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        const sessionToken = generateSessionToken(); // You might want to use the same token
        const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}?access_token=${accessToken}&session_token=${sessionToken}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          if (feature.geometry && feature.geometry.coordinates) {
            const [longitude, latitude] = feature.geometry.coordinates;
            // Update the form with coordinates
            form.setValue("longitude", longitude);
            form.setValue("latitude", latitude);
          }
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    },
    [form]
  );

  return (
    <Form {...form}>
      <form
        className="mx-auto flex flex-col gap-y-6 rounded-b-lg bg-white p-6 shadow-lg md:w-2/3"
        onSubmit={form.handleSubmit(onNextStep)}
      >
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="address">Complete Address</FormLabel>
              <FormControl>
                <AddressAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Start typing your address for suggestions..."
                  onSelect={handleAddressSelect}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Or Use Your Current Location
          </Label>
          <LocationPicker
            onAddressChange={handleAddressChange}
            defaultAddress={form.getValues("address")}
          />
          <ListingMinimap
            address={form.watch("address")}
            latitude={form.watch("latitude")}
            longitude={form.watch("longitude")}
          />
        </div>

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="contact">Contact</FormLabel>
              <FormControl>
                <Input placeholder="Ex. Phone Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebookProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="facebookProfile">Facebook Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex. https://facebook.com/george"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-x-4">
          <Button
            type="button"
            onClick={prevStep}
            disabled={isPrevPending}
            className="flex w-full flex-1 gap-x-3 font-bold uppercase"
          >
            {isPrevPending ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Previous Step
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex w-full flex-1 gap-x-3 font-bold uppercase"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};
