"use client";

import { routes } from "@/config/routes";
import { AwaitedPageProps, ListingFormStep } from "@/config/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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

export const LocationContact = (props: AwaitedPageProps) => {
  const { searchParams } = props;

  const form = useForm<LocationContactType>({
    resolver: zodResolver(LocationContactSchema),
    mode: "onTouched",
    defaultValues: {
      location: "",
      contact: "",
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

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

      url.searchParams.set("location", encodeURIComponent(data.location));
      url.searchParams.set("contact", encodeURIComponent(data.contact));

      router.push(url.toString());
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto flex flex-col gap-y-6 rounded-b-lg bg-white p-6 shadow-lg md:w-2/3"
        onSubmit={form.handleSubmit(onNextStep)}
      >
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="location">Location</FormLabel>
              <FormControl>
                <Input placeholder="Ex. City, State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
