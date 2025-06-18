"use client";

import { AwaitedPageProps, ListingFormStep } from "@/config/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CaretakerAvailability,
  CurfewPolicy,
  GenderPolicy,
  PetPolicy,
  KitchenAvailability,
  WifiAvailability,
  LaundryAvailability,
  UtilityInclusion,
} from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { routes } from "@/config/routes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { NativeSelect } from "../ui/native-select";
import { formatEnumValue } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { HouseRulesSchema, HouseRulesType } from "@/app/_schemas/form.schema";

export const HouseRulesStep = (props: AwaitedPageProps) => {
  const { searchParams } = props;
  const genderPolicy = (searchParams?.genderPolicy as string) ?? undefined;
  const curfew = (searchParams?.curfew as string) ?? undefined;
  const caretaker = (searchParams?.caretaker as string) ?? undefined;
  const pets = (searchParams?.pets as string) ?? undefined;
  const kitchen = (searchParams?.kitchen as string) ?? undefined;
  const wifi = (searchParams?.wifi as string) ?? undefined;
  const laundry = (searchParams?.laundry as string) ?? undefined;
  const utilities = (searchParams?.utilities as string) ?? undefined;

  const form = useForm<HouseRulesType>({
    resolver: zodResolver(HouseRulesSchema),
    mode: "onTouched",
    defaultValues: {
      genderPolicy: genderPolicy
        ? (decodeURIComponent(genderPolicy) as GenderPolicy)
        : GenderPolicy.MIXED,
      curfew: curfew
        ? (decodeURIComponent(curfew) as CurfewPolicy)
        : CurfewPolicy.NO_CURFEW,
      caretaker: caretaker
        ? (decodeURIComponent(caretaker) as CaretakerAvailability)
        : CaretakerAvailability.NOT_AVAILABLE,
      pets: pets
        ? (decodeURIComponent(pets) as PetPolicy)
        : PetPolicy.NOT_ALLOWED,
      kitchen: kitchen
        ? (decodeURIComponent(kitchen) as KitchenAvailability)
        : KitchenAvailability.NOT_AVAILABLE,
      wifi: wifi
        ? (decodeURIComponent(wifi) as WifiAvailability)
        : WifiAvailability.NOT_AVAILABLE,
      laundry: laundry
        ? (decodeURIComponent(laundry) as LaundryAvailability)
        : LaundryAvailability.NOT_AVAILABLE,
      utilities: utilities
        ? (decodeURIComponent(utilities) as UtilityInclusion)
        : UtilityInclusion.NOT_INCLUDED,
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", ListingFormStep.LOCATION_CONTACT.toString());
      router.push(url.toString());
    });
  };

  const onNextStep: SubmitHandler<HouseRulesType> = (data) => {
    startTransition(async () => {
      const valid = await form.trigger();
      if (!valid) return;

      await new Promise((resolve) => setTimeout(resolve, 500)); // Optional for loading effect

      const url = new URL(
        routes.createListing(ListingFormStep.UPLOAD_PHOTOS),
        process.env.NEXT_PUBLIC_APP_URL
      );

      if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) url.searchParams.set(key, value as string);
        });
      }

      url.searchParams.set("step", ListingFormStep.UPLOAD_PHOTOS.toString()); // Next step

      url.searchParams.set(
        "genderPolicy",
        encodeURIComponent(data.genderPolicy)
      );
      url.searchParams.set("curfew", encodeURIComponent(data.curfew));
      url.searchParams.set("caretaker", encodeURIComponent(data.caretaker));
      url.searchParams.set("pets", encodeURIComponent(data.pets));
      url.searchParams.set("kitchen", encodeURIComponent(data.kitchen));
      url.searchParams.set("wifi", encodeURIComponent(data.wifi));
      url.searchParams.set("laundry", encodeURIComponent(data.laundry));
      url.searchParams.set("utilities", encodeURIComponent(data.utilities));

      router.push(url.toString());
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto flex flex-col gap-y-6 rounded-b-lg bg-white p-6 shadow-lg md:w-2/3"
        onSubmit={form.handleSubmit(onNextStep)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="genderPolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="genderPolicy">Gender Policy</FormLabel>
                <FormControl>
                  <NativeSelect
                    options={Object.values(GenderPolicy).map(
                      (genderPolicy) => ({
                        value: genderPolicy,
                        label: formatEnumValue(genderPolicy),
                      })
                    )}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="curfew"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="curfew">Curfew Policy</FormLabel>
                <FormControl>
                  <NativeSelect
                    options={Object.values(CurfewPolicy).map((curfew) => ({
                      value: curfew,
                      label: formatEnumValue(curfew),
                    }))}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caretaker"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="caretaker">
                  Caretaker Availability
                </FormLabel>
                <FormControl>
                  <NativeSelect
                    options={Object.values(CaretakerAvailability).map(
                      (caretaker) => ({
                        value: caretaker,
                        label: formatEnumValue(caretaker),
                      })
                    )}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pets"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="pets">Pet Policy</FormLabel>
                <FormControl>
                  <NativeSelect
                    options={Object.values(PetPolicy).map((pets) => ({
                      value: pets,
                      label: formatEnumValue(pets),
                    }))}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kitchen"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="kitchen">Kitchen Availability</FormLabel>
                <FormControl>
                  <NativeSelect
                    options={Object.values(KitchenAvailability).map(
                      (kitchen) => ({
                        value: kitchen,
                        label: formatEnumValue(kitchen),
                      })
                    )}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wifi"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="wifi">Wi-Fi Availability</FormLabel>
                <FormControl>
                  <NativeSelect
                    options={Object.values(WifiAvailability).map((wifi) => ({
                      value: wifi,
                      label: formatEnumValue(wifi),
                    }))}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="laundry"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="laundry">Laundry Availability</FormLabel>
                <FormControl>
                  <NativeSelect
                    options={Object.values(LaundryAvailability).map(
                      (laundry) => ({
                        value: laundry,
                        label: formatEnumValue(laundry),
                      })
                    )}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="utilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="utilities">Utilities Inclusion</FormLabel>
                <FormControl>
                  <NativeSelect
                    options={Object.values(UtilityInclusion).map(
                      (utilities) => ({
                        value: utilities,
                        label: formatEnumValue(utilities),
                      })
                    )}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
